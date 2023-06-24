import { Amount, Button, Card, DateTime } from "@/components/ui";
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";
import {
  ColumnFiltersState,
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { TokenSymbol } from "@/lib/tokens";
import clsx from "clsx";

interface ActivityData {
  datetime: number;
  action: "deposit" | "withdraw";
  amount: number;
  token: TokenSymbol;
  status: "success" | "fulfilled" | "cancelled" | "queued";
}

const activityData: ActivityData[] = [
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 189874654,
    token: "USDC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 798421,
    token: "USDC",
    status: "cancelled",
  },
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 95473,
    token: "EUROC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 1024,
    token: "EUROC",
    status: "fulfilled",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 46245000,
    token: "USDC",
    status: "queued",
  },
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 189874654,
    token: "USDC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 798421,
    token: "USDC",
    status: "cancelled",
  },
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 95473,
    token: "EUROC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 1024,
    token: "EUROC",
    status: "fulfilled",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 46245000,
    token: "USDC",
    status: "queued",
  },
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 189874654,
    token: "USDC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 798421,
    token: "USDC",
    status: "cancelled",
  },
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 95473,
    token: "EUROC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 1024,
    token: "EUROC",
    status: "fulfilled",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 46245000,
    token: "USDC",
    status: "queued",
  },
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 189874654,
    token: "USDC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 798421,
    token: "USDC",
    status: "cancelled",
  },
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 95473,
    token: "EUROC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 1024,
    token: "EUROC",
    status: "fulfilled",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 46245000,
    token: "USDC",
    status: "queued",
  },
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 189874654,
    token: "USDC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 798421,
    token: "USDC",
    status: "cancelled",
  },
  {
    datetime: Date.now(),
    action: "deposit",
    amount: 95473,
    token: "EUROC",
    status: "success",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 1024,
    token: "EUROC",
    status: "fulfilled",
  },
  {
    datetime: Date.now(),
    action: "withdraw",
    amount: 46245000,
    token: "USDC",
    status: "queued",
  },
];

export const AppDashboardActivity: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const columnHelper = createColumnHelper<ActivityData>();

  const activityColumns = [
    columnHelper.accessor("datetime", {
      header: "Date",
      cell: (info) => (
        <Tooltip>
          <TooltipTrigger className="cursor-help text-fg/50 font-normal">
            <DateTime timestamp={info.getValue()} output="date" />
          </TooltipTrigger>
          <TooltipContent>
            <DateTime timestamp={info.getValue()} output="time" />
          </TooltipContent>
        </Tooltip>
      ),
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("token", {
      header: "Token",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <Tooltip>
          <TooltipTrigger className="cursor-help">
            <Amount value={info.getValue()} />
          </TooltipTrigger>
          <TooltipContent>{info.getValue().toLocaleString()}</TooltipContent>
        </Tooltip>
      ),
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        return (
          <div className="relative flex items-center gap-1.5 [&:hover_>_button]:opacity-100">
            <div
              className={clsx(
                "block w-3 h-3 aspect-square border-2 rounded-full",
                ["fulfilled", "success"].includes(status) && "bg-green-200 border-green-500",
                status === "queued" && "bg-yellow-200 border-orange-400",
                status === "cancelled" && "bg-red-200 border-red-500"
              )}
            ></div>
            <div
              className={clsx(
                "font-semibold flex gap-2 justify-center items-center",
                ["fulfilled", "success"].includes(status) && "text-green-500",
                status === "queued" && "text-orange-500",
                status === "cancelled" && "text-red-500"
              )}
            >
              <p>{status}</p>
            </div>
            {/* <div className="absolute inset-0  transition-opacity"> */}
            {status === "queued" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="tiny"
                    variant="destructive"
                    className="absolute w-full rounded-md opacity-0 transition-opacity flex justify-center items-center hover:bg-opacity-100"
                  >
                    <i className="ri-close-fill text-xl"></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cancel withdrawal request</TooltipContent>
              </Tooltip>
            )}
            {/* </div> */}
          </div>
        );
      },
    }),
  ];
  const sortableColumns = ["datetime", "action", "amount", "token", "status"];

  const table = useReactTable({
    data: activityData,
    columns: activityColumns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const headerGroup = table.getHeaderGroups()[0];
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col items-center px-4 pt-10 pb-6", className)}
    >
      <h2 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">Activity</h2>

      {/* <Input
          placeholder="Search for activity..."
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="mx-2 inline-block w-64 mb-2 self-start"
        /> */}

      <div className="w-full grid grid-cols-[repeat(5,minmax(0,200px))] text-sm overflow-y-scroll font-medium rounded-3xl px-2">
        {headerGroup.headers.map((header, cellIndex) => {
          const content = flexRender(header.column.columnDef.header, header.getContext());
          return (
            <div
              key={header.column.id}
              className={clsx("py-4", cellIndex === 0 && "pl-4", cellIndex === 4 && "pr-4")}
            >
              {(sortableColumns.includes(header.column.id) && (
                <button
                  onClick={() => header.column.toggleSorting(header.column.getIsSorted() === "asc")}
                  className="flex gap-1 font-semibold text-fg/50"
                >
                  {content}
                  <span className="text-fg/30">
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
              )) ||
                content}
            </div>
          );
        })}
        {(() => {
          const tableRows = table.getRowModel().rows;
          if (tableRows.length === 0) return <p>No results.</p>;
          else {
            return tableRows.map((row, rowIndex) =>
              row.getVisibleCells().map((cell, cellIndex) => (
                <div
                  key={cell.id}
                  style={{
                    gridColumnStart: cellIndex + 1,
                  }}
                  className={clsx(
                    "py-4 font-medium",
                    rowIndex % 2 === 0 && "bg-fg/5",
                    cellIndex === 0 && "rounded-l-md pl-4",
                    cellIndex === 4 && "rounded-r-md pr-4"
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))
            );
          }
        })()}
      </div>
    </Card>
  );
};
