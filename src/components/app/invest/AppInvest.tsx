"use client";
import { Amount, Button, Card } from "@/components/ui";
import React, { FC, useEffect, useState } from "react";
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
import { useDApp } from "@/hooks";
import { readGenericStableToken, readLToken } from "@/generated";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getLTokenAddress } from "@/lib/getLTokenAddress";
import { Spinner } from "@/components/ui/Spinner";

interface Pool {
  tokenSymbol: string;
  decimals: number;
  apr: number;
  tvl: bigint;
  invested: bigint;
}

export const AppInvest: FC = React.memo(() => {
  const { walletClient, chain } = useDApp();
  const [sorting, setSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper<Pool>();
  const lTokens = useAvailableLTokens();
  const [tableData, setTableData] = useState<Pool[]>([]);
  const [initialFetch, setInitialFetch] = useState(false);

  const tvl = 19487512123456n;
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
      cell: (info) => info.getValue() + "%",
      header: "APR",
    }),
    columnHelper.accessor("tvl", {
      cell: (info) => <Amount value={info.getValue()} />,
      header: "TVL",
    }),
    columnHelper.accessor("invested", {
      cell: (info) => <Amount value={info.getValue()} />,

      header: "Invested",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const tokenSymbol = row.getValue("tokenSymbol");
        return (
          <div className="inline-flex gap-4">
            <DepositDialog tokenSymbol={tokenSymbol}>
              <Button size="small">Deposit</Button>
            </DepositDialog>
            <WithdrawDialog tokenSymbol={tokenSymbol}>
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

  const fetchTableData = async () => {
    const _tableData: Pool[] = [];
    for (const lTokenId of lTokens) {
      const address = getLTokenAddress(lTokenId, chain.id);
      const decimals = await readLToken({ address: address, functionName: "decimals" });
      const totalSupply = await readLToken({ address: address, functionName: "totalSupply" });
      const balance = walletClient
        ? await readLToken({
            address: address,
            functionName: "balanceOf",
            args: [walletClient.account.address],
          })
        : 0n;
      const apr = await readLToken({ address: address, functionName: "getApr" });
      const underlyingAddress = await readLToken({ address: address, functionName: "underlying" });
      const underlyingSymbol = await readGenericStableToken({
        address: underlyingAddress,
        functionName: "symbol",
      });
      _tableData.push({
        tokenSymbol: underlyingSymbol,
        invested: balance,
        decimals: decimals,
        tvl: totalSupply,
        apr: apr,
      });
    }
    setTableData(_tableData);
    setInitialFetch(true);
  };

  useEffect(() => {
    setInitialFetch(false);
    fetchTableData();
  }, [chain, walletClient]);

  return (
    <div className="flex flex-col justify-center items-center w-[900px] ">
      <section className="grid grid-cols-3 w-full gap-10 mb-10">
        <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
          <h2 className="text-center text-lg font-medium text-indigo-900/80">TVL</h2>
          <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
            $<Amount value={tvl} decimals={decimals} />
          </div>
        </Card>
        <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
          <h2 className="text-center text-lg font-medium text-indigo-900/80">Distributed rewards</h2>
          <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
            $<Amount value={distrubutedRewards} decimals={decimals} />
          </div>
        </Card>
        <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
          <h2 className="text-center text-lg font-medium text-indigo-900/80">1 year variation</h2>
          <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
            ±0.08%
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
                          className="flex gap-1"
                        >
                          {content}
                          <span className="text-fg/60">
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
                    className="grid grid-cols-[2fr,2fr,2fr,2fr,3fr] mb-4 py-6 px-6 font-medium text-base"
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
});
AppInvest.displayName = "AppInvest";
