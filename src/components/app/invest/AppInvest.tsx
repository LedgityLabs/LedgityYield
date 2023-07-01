"use client";
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
import { getGenericErc20, getLToken } from "@/generated";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getContractAddress } from "@/lib/getContractAddress";
import { Spinner } from "@/components/ui/Spinner";
import { formatUnits, parseUnits } from "viem";
import { watchReadContracts } from "@wagmi/core";
import { ContractId } from "../../../../hardhat/deployments";
import clsx from "clsx";
import { usePublicClient, useWalletClient } from "wagmi";

/**
 * This function splits an array into chunks of the given size. E.g., [1,2,3,4,5,6] with chunk size 2
 * will result in [[1,2],[3,4],[5,6]]
 *
 * @param array The array to split
 * @param chunkSize The size of each chunk
 * @returns The array split into chunks
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, i) =>
    array.slice(i * chunkSize, i * chunkSize + chunkSize)
  );
}

interface Pool {
  tokenSymbol: string;
  apr: number;
  tvl: [bigint, number];
  tvlUsd: bigint;
  invested: [bigint, number];
}

/**
 * About 'tableData', 'futureTableData' and 'isActionsDialogOpen': As the table is automatically
 * refreshed when on-chain data changes, and while DepositDialog and WithdrawDialog contained in the
 * table, if the data changes while the dialog is open, the dialog will be closed. This incurs a bad user
 * experience. To prevent this:
 *
 * 1. We track if any actions dialog is opened in 'isActionsDialogOpen' ref
 * 2. When new data are received, if not actions dialog are opened -> call setTableData() instantly
 * 3. Else we store the new data into 'futureTableData' ref to prevent causing a re-render of the table
 *    while the user is in deposit/withdraw modals
 * 4. Finally, when the user closes the action modal, we call 'setTableData(futureTableData)' to provides it
 *    with most up to date data.
 */
export const AppInvest: FC = () => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<Pool>();
  const lTokens = useAvailableLTokens();
  const [tableData, setTableData] = useState<Pool[]>([]);
  const [initialFetch, setInitialFetch] = useState(false);
  let isActionsDialogOpen = useRef(false);
  let futureTableData = useRef<Pool[]>([]);

  let tvl = 0n;
  for (const tableRow of tableData) {
    tvl += tableRow.tvlUsd;
  }

  const distrubutedRewards = 945512123456n;
  const decimals = 6;

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
        return <Amount value={amount} decimals={decimals} suffix={tokenSymbol} displaySymbol={false} />;
      },
      header: "TVL",
    }),
    columnHelper.accessor("invested", {
      cell: (info) => {
        const [amount, decimals] = info.getValue() as [bigint, number];
        const tokenSymbol = info.row.getValue("tokenSymbol") as string;
        return <Amount value={amount} decimals={decimals} suffix={tokenSymbol} displaySymbol={false} />;
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

  function watchData() {
    if (publicClient.chain) {
      let reads: Parameters<typeof watchReadContracts>[0]["contracts"] = [];
      for (const lTokenId of lTokens) {
        const lTokenContractAddress = getContractAddress(lTokenId, publicClient.chain.id);
        const underlyingContractAddress = getContractAddress(
          lTokenId.slice(1) as ContractId,
          publicClient.chain.id
        );
        if (!lTokenContractAddress || !underlyingContractAddress)
          console.error(
            "Some contracts addresses are missing for the current chain. Cannot watch data."
          );
        else {
          const lTokenContract = getLToken({ address: lTokenContractAddress });
          const underlyingContract = getGenericErc20({ address: underlyingContractAddress });
          reads = [
            ...reads,
            {
              address: underlyingContract.address,
              abi: underlyingContract.abi,
              functionName: "symbol",
            },
            {
              address: lTokenContract.address,
              abi: lTokenContract.abi,
              functionName: "symbol",
              // args: [walletClient ? walletClient.account.address : zeroAddress],
            },
            {
              address: lTokenContract.address,
              abi: lTokenContract.abi,
              functionName: "decimals",
            },
            {
              address: lTokenContract.address,
              abi: lTokenContract.abi,
              functionName: "totalSupply",
            },
            {
              address: lTokenContract.address,
              abi: lTokenContract.abi,
              functionName: "getApr",
            },
          ];
        }
      }

      // If there are nothing to read, set initial fetch to true
      if (reads.length === 0) setInitialFetch(true);
      // Else, watch array of function reads
      else {
        return watchReadContracts(
          {
            contracts: reads,
            listenToBlock: true,
          },
          (data) => {
            const _tableData: Pool[] = [];
            const proms: Promise<void>[] = [];
            for (const rowData of chunkArray(data, 5)) {
              const tokenSymbol = rowData[0].result! as string;
              const tvl = [rowData[3].result!, rowData[2].result!] as [bigint, number];

              proms.push(
                fetch(`https://api.coinbase.com/v2/exchange-rates?currency=${tokenSymbol}`)
                  .then((response) => response.json()) // Parse the JSON from the response
                  .then((ratesData) => {
                    console.log(ratesData);
                    // Extract the USD rate
                    const usdRate = ratesData.data.rates.USD;
                    _tableData.push({
                      tokenSymbol: tokenSymbol,
                      invested: [0n, rowData[2].result!] as [bigint, number],
                      tvl: tvl,
                      tvlUsd: parseUnits((usdRate * Number(formatUnits(tvl[0], tvl[1]))).toString(), 6),
                      apr: rowData[4].result! as number,
                    });
                  })
                  .catch((error) => {
                    console.error(`Error while fetching USD rate of ${tokenSymbol}:`, error);
                  })
              );
            }
            Promise.all(proms).then(() => {
              if (!isActionsDialogOpen.current) setTableData(_tableData);
              else futureTableData.current = _tableData;
              setInitialFetch(true);
            });
          }
        );
      }
    } else setInitialFetch(true);
  }

  useEffect(() => {
    setInitialFetch(false);
    return watchData();
  }, [walletClient, publicClient.chain]);

  return (
    <div className="flex flex-col justify-center items-center w-[900px] ">
      <section className="grid grid-cols-3 w-full gap-10 mb-10">
        <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
          <h2 className="text-center text-lg font-medium text-indigo-900/80">TVL</h2>
          <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
            <Amount prefix="$" value={tvl} decimals={6} />
          </div>
        </Card>
        <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
          <h2 className="text-center text-lg font-medium text-indigo-900/80">Distributed rewards</h2>
          <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
            <Amount prefix="$" value={distrubutedRewards} decimals={decimals} />
          </div>
        </Card>
        <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
          <h2 className="text-center text-lg font-medium text-indigo-900/80">1 year variation</h2>
          <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
            <Rate value={137} prefix={"±"} />
          </div>
        </Card>
        <article className="col-span-3">
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
                    header.column.id === "tokenSymbol" && "justify-start pl-6"
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
                              header.column.id !== "apr" && "absolute -right-5"
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
          {(!initialFetch && (
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
                          cell.column.id === "apr" && "text-indigo-800 font-bold"
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
                <p className="text-center mt-10 block">No investment opportunities on this chain yet.</p>
              )}
            </>
          )}
        </article>
      </section>
    </div>
  );
};
