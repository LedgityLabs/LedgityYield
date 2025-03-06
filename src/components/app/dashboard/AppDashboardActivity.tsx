"use client";

import { Activity, LToken } from "../../../../.graphclient";
// Components
import { CancelWithdrawalRequestTx } from "@/components/contracts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Amount,
  Button,
  DateTime,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { getSortIcon } from "@/functions/helpers";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// Hooks
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useLTokenWithdrawalQueue } from "@/hooks/contracts";
import { useUserActivityData } from "@/hooks/subgraph/useUserActivityData";
import { useEffect, useState } from "react";
// Types
import { Address } from "viem";

function CancelButton({
  lTokenSchema,
  requestId,
}: {
  lTokenSchema: LToken;
  requestId: bigint;
  amount: bigint;
}) {
  // @dev To be checked but it seems the token addres is called in the subgraph schemas
  const lTokenAddress = lTokenSchema.id as Address;
  const requestData = useLTokenWithdrawalQueue(lTokenAddress, requestId);
  const withdrawalAmount = requestData[1];

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild className="absolute -inset-y-1 inset-x-0">
          <AlertDialogTrigger asChild>
            <Button
              size="tiny"
              variant="destructive"
              className="flex h-full w-full items-center justify-center rounded-lg opacity-0 transition-opacity hover:bg-opacity-100 hover:opacity-100"
            >
              <i className="ri-close-fill text-xl"></i>
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent className="font-semibold">
          Cancel withdrawal request
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and{" "}
            <span className="font-semibold">
              you will loose your current position
            </span>{" "}
            in the withdrawal queue.
            <br />
            <br />
            By cancelling this request{" "}
            <span className="font-semibold">
              you will receive your{" "}
              <Amount
                value={withdrawalAmount}
                decimals={lTokenSchema.decimals}
              />{" "}
              {lTokenSchema.symbol}{" "}
            </span>
            tokens back to your wallet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction customButton={true}>
            <CancelWithdrawalRequestTx
              buttonText="Cancel Request"
              contractAddress={lTokenAddress}
              params={{
                requestId: requestId,
              }}
            />
          </AlertDialogAction>
          <AlertDialogCancel />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AppDashboardActivity({ className }: { className?: string }) {
  const { currentAccount, appChainId } = useWeb3Context();
  const { activityData, isLoading } = useUserActivityData(
    appChainId,
    currentAccount,
  );

  /**
   * ==============
   * Table Settings
   * ==============
   */

  const columnHelper = createColumnHelper<Activity>();

  const activityColumns = [
    columnHelper.accessor("timestamp", {
      header: "Date",
      cell: (info) => {
        return (
          <DateTime
            timestamp={Number.parseInt(info.getValue()) * 1000}
            output="date"
            className="cursor-help text-fg/50"
          />
        );
      },
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("ltoken", {
      header: "L-Token",
      cell: (info) => info.getValue().symbol,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => {
        const amount = info.getValue();
        const amountAfterFees = info.row.original.amountAfterFees;
        const ltoken = info.row.original.ltoken;
        return (
          <Amount
            value={BigInt(amount)}
            decimals={ltoken.decimals}
            suffix={ltoken.symbol}
            displaySymbol={false}
            tooltipChildren={
              amount !== amountAfterFees && (
                <span>
                  <span className="font-medium opacity-80">
                    Received after fees:{" "}
                  </span>
                  <Amount
                    tooltip={false}
                    value={BigInt(amountAfterFees)}
                    decimals={ltoken.decimals}
                    suffix={ltoken.symbol}
                  />
                </span>
              )
            }
          />
        );
      },
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const ltoken = info.row.original.ltoken;
        const requestId = info.row.original.requestId;
        const amount = info.row.original.amount;
        return (
          <div className="relative flex items-center gap-1.5 [&:hover_>_button]:opacity-100">
            <div
              className={`block aspect-square h-3 w-3 rounded-full border-2 ${
                status === "Fulfilled" || status === "Success"
                  ? "border-emerald-500 bg-emerald-200"
                  : ""
              } ${status === "Queued" ? "border-amber-500 bg-amber-200" : ""} ${
                status === "Cancelled" ? "border-red-500 bg-red-200" : ""
              }`}
            ></div>

            <div
              className={`flex items-center justify-center gap-2 font-semibold ${
                status === "Fulfilled" || status === "Success"
                  ? "text-emerald-500"
                  : ""
              } ${status === "Queued" ? "text-amber-500" : ""} ${
                status === "Cancelled" ? "text-red-500" : ""
              }`}
            >
              <p>{status}</p>
            </div>
            {status === "Queued" && (
              <CancelButton
                lTokenSchema={ltoken}
                requestId={BigInt(requestId)}
                amount={BigInt(amount)}
              />
            )}
          </div>
        );
      },
    }),
  ];

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "timestamp",
      desc: true,
    },
  ]);
  const sortableColumns = ["timestamp", "action", "amount", "ltoken", "status"];

  const table = useReactTable({
    data: activityData,
    columns: activityColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Set page size
  useEffect(() => table.setPageSize(10), []);

  const headerGroup = table.getHeaderGroups()[0];
  const tableRows = table.getRowModel().rows;

  return (
    <div className="w-full flex-col">
      <div
        className={`grid w-full grid-cols-[repeat(5,minmax(0,200px))] border-b border-b-fg/20 ${className}`}
      >
        {headerGroup.headers.map((header, index) => (
          <div
            key={header.column.id}
            style={{
              gridColumnStart: index + 1,
            }}
            className="inline-flex items-center justify-center py-3 bg-fg/5 border-y border-y-fg/10 font-semibold text-fg/50"
          >
            {sortableColumns.includes(header.column.id) ? (
              <button
                onClick={() =>
                  header.column.toggleSorting(
                    header.column.getIsSorted() === "asc",
                  )
                }
                className="flex items-center gap-1"
              >
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
                <span>{getSortIcon(header.column.getIsSorted())}</span>
              </button>
            ) : (
              flexRender(header.column.columnDef.header, header.getContext())
            )}
          </div>
        ))}

        {isLoading && (
          <div className="my-10 flex col-span-5 w-full items-center justify-center">
            <Spinner />
          </div>
        )}

        {!isLoading && !tableRows.length && (
          <p className="my-10 col-span-5 w-full block text-center text-lg font-semibold text-fg/60">
            No activity yet.
          </p>
        )}

        {!isLoading &&
          tableRows.length &&
          tableRows.map((row, i) =>
            row.getVisibleCells().map((cell, j) => (
              <div
                key={cell.id}
                style={{
                  gridColumnStart: j + 1,
                }}
                className={`inline-flex items-center justify-center py-3 border-b border-b-fg/20 font-medium text-fg/90 text-[0.9rem] ${i + 1 == tableRows.length ? "border-b-0" : ""}`}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            )),
          )}
      </div>

      <div className="flex justify-center items-center gap-3 py-4">
        <Button
          size="tiny"
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <i className="ri-arrow-left-line mr-2" />
          Newer
        </Button>
        <Button
          size="tiny"
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Older
          <i className="ri-arrow-right-line ml-2" />
        </Button>
      </div>
    </div>
  );
}
