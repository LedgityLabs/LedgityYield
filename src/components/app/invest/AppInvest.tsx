"use client";
import { Button, Card } from "@/components/ui";
import React, { FC } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import Image from "next/image";
import usdcTokenLogo from "~/assets/tokens/usdc.png";
import eurocTokenLogo from "~/assets/tokens/euroc.png";
import { twMerge } from "tailwind-merge";
import * as d3 from "d3-format";
import clsx from "clsx";

const tokensLogos = {
  USDC: usdcTokenLogo,
  EUROC: eurocTokenLogo,
};
type TokenSymbol = keyof typeof tokensLogos;

interface Pool {
  tokenSymbol: TokenSymbol;
  apy: number;
  tvl: number;
  invested: number;
}
const data: Pool[] = [
  {
    tokenSymbol: "USDC",
    apy: 6.841,
    tvl: 13770000,
    invested: 87330,
  },
  {
    tokenSymbol: "EUROC",
    apy: 5.423,
    tvl: 3670184,
    invested: 0,
  },
];

export const AppInvest: FC = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columnHelper = createColumnHelper<Pool>();

  const columns = [
    columnHelper.accessor("tokenSymbol", {}),
    columnHelper.display({
      id: "name",
      header: "Name",
      cell: ({ row }) => {
        const tokenSymbol = row.getValue("tokenSymbol") as TokenSymbol;
        return (
          <div className="flex gap-3 items-center">
            <Image src={tokensLogos[tokenSymbol]} alt={`${tokenSymbol}'s logo`} width={35} height={35} />
            <p>{tokenSymbol}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("apy", {
      cell: (info) => info.getValue().toFixed(1) + "%",
      header: "APY",
    }),
    columnHelper.accessor("tvl", {
      cell: (info) => d3.format(".3s")(info.getValue()),
      header: "TVL",
    }),
    columnHelper.accessor("invested", {
      cell: (info) => d3.format(".3s")(info.getValue()),

      header: "Invested",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="inline-flex gap-4">
          <Button size="small">Deposit</Button>
          <Button size="small" variant="outline">
            Withdraw
          </Button>
        </div>
      ),
    }),
  ];
  const sortableColumns = ["apy", "tvl", "invested"];

  const table = useReactTable({
    data,
    columns,
    state: {
      columnVisibility: {
        tokenSymbol: false,
      },
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroup = table.getHeaderGroups()[0];

  return (
    <div className="flex flex-col justify-center items-center w-[900px]">
      <section className="grid grid-cols-3 w-full gap-10 mb-10">
        <article>
          <Card className="h-52 flex justify-center items-center">
            <p>TVL</p>
          </Card>
        </article>
        <article>
          <Card className="h-52 flex justify-center items-center">
            <p>Rewards</p>
          </Card>
        </article>
        <article>
          <Card className="h-52 flex justify-center items-center">
            <p>Stability</p>
          </Card>
        </article>
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
                    header.column.id === "name" && "justify-start pl-6"
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
                                  return <i className="ri-sort-asc"></i>;
                                case "desc":
                                  return <i className="ri-sort-desc"></i>;
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

          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Card
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="grid grid-cols-[2fr,2fr,2fr,2fr,3fr] mb-4 py-6 px-6 font-medium text-base"
              >
                {row.getVisibleCells().map((cell, index) => (
                  <div
                    key={cell.id}
                    className={twMerge(
                      "flex items-center",
                      cell.column.id !== "name" && "justify-center",
                      cell.column.id === "actions" && "justify-end",
                      cell.column.id === "apy" && "text-indigo-800 font-bold"
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
            <p>No results.</p>
          )}
        </article>
      </section>
    </div>
  );
};
