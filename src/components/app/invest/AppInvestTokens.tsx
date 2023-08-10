import { Amount, Button, Card, Rate } from "@/components/ui";
import React, { FC, useEffect, useRef, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { twMerge } from "tailwind-merge";
import { TokenLogo } from "../../ui/TokenLogo";
import { DepositDialog } from "../DepositDialog";
import { WithdrawDialog } from "../WithdrawDialog";
import { lTokenABI, genericErc20ABI } from "@/generated";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getContractAddress } from "@/lib/getContractAddress";
import { Spinner } from "@/components/ui/Spinner";
import { zeroAddress } from "viem";
import { watchReadContracts } from "@wagmi/core";
import clsx from "clsx";
import { usePublicClient, useWalletClient } from "wagmi";
import { JSONStringify } from "@/lib/jsonStringify";

interface Pool {
  tokenSymbol: string;
  apr: number;
  tvl: [bigint, number];
  invested: [bigint, number];
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {}
/**
 * About 'tableData', 'futureTableData' and 'isActionsDialogOpen': As the table is automatically
 * refreshed when on-chain data changes, and while DepositDialog and WithdrawDialog contained in the
 * table, if the data changes while the dialog is open, the dialog will be closed. To avoid a poor UX:
 *
 * 1. We track if any actions dialog is opened in 'isActionsDialogOpen' ref
 * 2. When new data are received, if not actions dialog are opened -> call setTableData() instantly
 * 3. Else we store the new data into 'futureTableData' ref to prevent causing a re-render of the table
 *    while the user is in deposit/withdraw modals
 * 4. Finally, when the user closes the action modal, we call 'setTableData(futureTableData)' to provides it
 *    with most up to date data.
 */
export const AppInvestTokens: FC<Props> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<Pool>();
  const lTokens = useAvailableLTokens();
  const [readsConfig, setReadsConfig] = useState<
    Parameters<typeof watchReadContracts>[0]["contracts"]
  >([]);
  const [tableData, setTableData] = useState<Pool[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  let isActionsDialogOpen = useRef(false);
  let futureTableData = useRef<Pool[]>([]);

  const columns = [
    columnHelper.accessor("tokenSymbol", {
      header: "Name",
      cell: (info) => {
        const tokenSymbol = info.getValue();
        return (
          <div className="flex gap-3 items-center">
            <TokenLogo symbol={tokenSymbol} size={35} />
            <p>{tokenSymbol}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("apr", {
      cell: (info) => <Rate value={info.getValue()} />,
      header: "APR",
    }),
    columnHelper.accessor("tvl", {
      cell: (info) => {
        const [amount, decimals] = info.getValue() as [bigint, number];
        const tokenSymbol = info.row.getValue("tokenSymbol") as string;
        return (
          <Amount value={amount} decimals={decimals} suffix={tokenSymbol} displaySymbol={false} />
        );
      },
      header: "TVL",
    }),
    columnHelper.accessor("invested", {
      cell: (info) => {
        const [amount, decimals] = info.getValue() as [bigint, number];
        const tokenSymbol = info.row.getValue("tokenSymbol") as string;
        return (
          <Amount value={amount} decimals={decimals} suffix={tokenSymbol} displaySymbol={false} />
        );
      },
      header: "Invested",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const tokenSymbol = row.getValue("tokenSymbol") as string;
        return (
          <div className="inline-flex gap-4">
            <DepositDialog
              underlyingSymbol={tokenSymbol}
              onOpenChange={(o) => {
                isActionsDialogOpen.current = o;
                if (o === false && futureTableData.current.length > 0) {
                  setTableData(futureTableData.current);
                  futureTableData.current = [];
                }
              }}
            >
              <Button size="small">Deposit</Button>
            </DepositDialog>
            <WithdrawDialog
              underlyingSymbol={tokenSymbol}
              onOpenChange={(o) => {
                isActionsDialogOpen.current = o;
                if (o === false && futureTableData.current.length > 0) {
                  setTableData(futureTableData.current);
                  futureTableData.current = [];
                }
              }}
            >
              <Button size="small" variant="outline">
                Withdraw
              </Button>
            </WithdrawDialog>
          </div>
        );
      },
    }),
  ];
  const sortableColumns = ["apr", "tvl", "invested"];

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroup = table.getHeaderGroups()[0];

  function populateReadsConfig() {
    const newReadsConfig = [] as {
      address: `0x${string}`;
      abi: any;
      functionName: string;
      args?: any[];
    }[];

    // Push read calls for total supply and decimals of each lToken
    for (const lTokenSymbol of lTokens) {
      // Retrieve contracts addresses
      const lTokenAddress = getContractAddress(lTokenSymbol, publicClient.chain.id);
      const underlyingAddress = getContractAddress(lTokenSymbol.slice(1), publicClient.chain.id);

      // Ensure no address is missing
      if (!lTokenAddress || !underlyingAddress)
        throw "Some contracts addresses are missing for the current chain. Cannot watch data.";

      // Populate required reads requests
      newReadsConfig.push({
        address: lTokenAddress,
        abi: lTokenABI,
        functionName: "balanceOf",
        args: [walletClient ? walletClient.account.address : zeroAddress],
      });
      ["decimals", "totalSupply", "getApr"].forEach((functionName) => {
        newReadsConfig.push({
          address: lTokenAddress,
          abi: lTokenABI,
          functionName: functionName,
        });
      });
    }

    if (JSON.stringify(newReadsConfig) !== JSON.stringify(readsConfig)) {
      setIsLoading(true);
      setReadsConfig(newReadsConfig);
    }
  }

  useEffect(populateReadsConfig, [publicClient.chain.id, walletClient, readsConfig]);

  useEffect(
    () =>
      watchReadContracts(
        {
          contracts: readsConfig,
          listenToBlock: true,
        },
        (data) => {
          const _tableData: Pool[] = [];
          for (const lTokenSymbol of lTokens) {
            const underlyingSymbol = lTokenSymbol.slice(1);
            const investedAmount = data.shift()!.result! as bigint;
            const decimals = data.shift()!.result! as number;
            const tvl = data.shift()!.result! as bigint;
            const apr = data.shift()!.result! as number;

            _tableData.push({
              tokenSymbol: underlyingSymbol,
              invested: [investedAmount, decimals],
              tvl: [tvl, decimals],
              apr: apr,
            });
          }

          // Update table data only if it has changed
          if (JSONStringify(tableData) != JSONStringify(_tableData)) {
            if (!isActionsDialogOpen.current) setTableData(_tableData);
            else futureTableData.current = _tableData;
          }
          setIsLoading(false);
        },
      ),
    [readsConfig, tableData, walletClient],
  );

  return (
    <article className={className}>
      <div className="grid grid-cols-[2fr,2fr,2fr,2fr,3fr] font-semibold mb-3 px-6 text-fg/80">
        {headerGroup.headers.map((header, index) => {
          return (
            <div
              key={header.id}
              style={{
                gridColumnStart: index + 1,
              }}
              className={twMerge(
                "flex justify-center items-center",
                header.column.id === "tokenSymbol" && "justify-start pl-6",
              )}
            >
              {(() => {
                const content = flexRender(header.column.columnDef.header, header.getContext());
                if (sortableColumns.includes(header.column.id))
                  return (
                    <button
                      onClick={() =>
                        header.column.toggleSorting(header.column.getIsSorted() === "asc")
                      }
                      className="relative flex items-center gap-1"
                    >
                      {content}
                      <span
                        className={clsx(
                          "text-fg/60",
                          header.column.id !== "apr" && "absolute -right-5",
                        )}
                      >
                        {(() => {
                          switch (header.column.getIsSorted()) {
                            case "asc":
                              return <i className="ri-sort-desc"></i>;
                            case "desc":
                              return <i className="ri-sort-asc"></i>;
                            default:
                              return <i className="ri-expand-up-down-fill"></i>;
                          }
                        })()}
                      </span>
                    </button>
                  );
                else return content;
              })()}
            </div>
          );
        })}
      </div>
      {(isLoading && (
        <div className="w-full flex justify-center items-center mt-10">
          <Spinner />
        </div>
      )) || (
        <>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Card
                key={row.id}
                circleIntensity={0.07}
                data-state={row.getIsSelected() && "selected"}
                className="grid grid-cols-[2fr,2fr,2fr,2fr,3fr] mb-4 py-6 px-6 font-medium text-base animate-fadeAndMoveIn"
              >
                {row.getVisibleCells().map((cell, index) => (
                  <div
                    key={cell.id}
                    className={twMerge(
                      "flex items-center",
                      cell.column.id !== "tokenSymbol" && "justify-center",
                      cell.column.id === "actions" && "justify-end",
                      cell.column.id === "apr" && "text-indigo-800 font-bold",
                    )}
                    style={{
                      gridColumnStart: index + 1,
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </Card>
            ))
          ) : (
            <p className="text-center mt-10 block">
              No investment opportunities on this chain yet.
            </p>
          )}
        </>
      )}
    </article>
  );
};
