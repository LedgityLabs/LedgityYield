"use client";
import {
  Amount,
  Button,
  Card,
  DateTime,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Spinner,
  TxButton,
} from "@/components/ui";
import React, { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Activity, LToken, execute } from "graphclient";
import { useWalletClient } from "wagmi";
import { useContractAddress } from "@/hooks/useContractAddress";
import {
  useLTokenDecimals,
  useLTokenGetWithdrawnAmountAndFees,
  usePrepareLTokenCancelWithdrawalRequest,
} from "@/generated";
import { zeroAddress } from "viem";

const CancelButton: FC<{ lTokenSymbol: string; requestId: bigint; amount: bigint }> = ({
  lTokenSymbol,
  requestId,
}) => {
  const { data: walletClient } = useWalletClient();
  const ltokenAddress = useContractAddress(lTokenSymbol);
  const { data: decimals } = useLTokenDecimals({
    address: ltokenAddress,
  });
  const { data: amountAndFees } = useLTokenGetWithdrawnAmountAndFees({
    address: ltokenAddress,
    args: [walletClient ? walletClient.account.address : zeroAddress, requestId],
    watch: true,
  });
  const preparation = usePrepareLTokenCancelWithdrawalRequest({
    address: ltokenAddress,
    args: [requestId],
  });

  useEffect(() => {
    preparation.refetch();
  }, [amountAndFees]);

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
        <TooltipContent>Cancel withdrawal request</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone and{" "}
            <span className="font-semibold">you will loose your current position</span> in the
            withdrawal queue.
            <br />
            <br />
            By cancelling this request{" "}
            <span className="font-semibold">
              you will receive your{" "}
              <Amount value={amountAndFees ? amountAndFees[0] : 0n} decimals={decimals} />{" "}
              {lTokenSymbol}{" "}
            </span>
            tokens back to your wallet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction customButton={true}>
            <TxButton variant="destructive" size="small" preparation={preparation}>
              Cancel this request
            </TxButton>
          </AlertDialogAction>
          <AlertDialogCancel />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const AppDashboardActivity: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "timestamp",
      desc: true,
    },
  ]);
  const columnHelper = createColumnHelper<Activity>();
  const [activityData, setActivityData] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (walletClient) {
      setIsLoading(true);
      execute(
        `
      {
        activities(where: { account: "${walletClient.account.address}" }) {
          id
          requestId
          ltoken {
            symbol
            decimals
          }
          timestamp
          action
          amount
          amountAfterFees
          status
        }
      }
    `,
      )
        .then(
          (result: {
            data: {
              activities: Activity[];
            };
          }) => {
            setActivityData(result.data.activities);
            setIsLoading(false);
          },
        )
        .catch((e: Error) => {
          setActivityData([]);
          setIsLoading(false);
        });
    }
  }, [setActivityData, walletClient]);

  const activityColumns = [
    columnHelper.accessor("timestamp", {
      header: "Date",
      cell: (info) => {
        return (
          <DateTime
            timestamp={Number.parseInt(info.getValue()) * 1000}
            output="date"
            className="cursor-help font-normal text-fg/50"
          />
        );
      },
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("ltoken", {
      header: "Token",
      cell: (info) => info.getValue().symbol,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => {
        const amount = info.getValue() as string;
        const amountAfterFees = activityData[info.row.index].amountAfterFees as string;
        const ltoken = info.row.getValue("ltoken") as LToken;
        return (
          <Amount
            value={BigInt(amount)}
            decimals={ltoken.decimals}
            suffix={ltoken.symbol}
            displaySymbol={false}
            tooltipChildren={
              amount !== amountAfterFees && (
                <span>
                  <span className="font-medium opacity-80">Received after fees: </span>
                  <Amount
                    tooltip={false}
                    value={BigInt(amountAfterFees)}
                    decimals={ltoken.decimals}
                    suffix={ltoken.symbol}
                  />
                </span>
              )
            }
            className="inline-block pl-4"
          />
        );
      },
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const ltoken = info.row.getValue("ltoken") as LToken;
        const requestId = activityData[info.row.index].requestId;
        const amount = info.row.getValue("amount") as string;
        return (
          <div className="relative flex items-center gap-1.5 [&:hover_>_button]:opacity-100">
            <div
              className={clsx(
                "block aspect-square h-3 w-3 rounded-full border-2",
                ["Fulfilled", "Success"].includes(status) && "border-emerald-500 bg-emerald-200",
                status === "Queued" && "border-amber-500 bg-amber-200",
                status === "Cancelled" && "border-red-500 bg-red-200",
              )}
            ></div>
            <div
              className={clsx(
                "flex items-center justify-center gap-2 font-semibold",
                ["Fulfilled", "Success"].includes(status) && "text-emerald-500",
                status === "Queued" && "text-amber-500",
                status === "Cancelled" && "text-red-500",
              )}
            >
              <p>{status}</p>
            </div>
            {status === "Queued" && (
              <CancelButton
                lTokenSymbol={ltoken.symbol}
                requestId={BigInt(requestId)}
                amount={BigInt(amount)}
              />
            )}
          </div>
        );
      },
    }),
  ];
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
  });

  const headerGroup = table.getHeaderGroups()[0];
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col items-center px-4 pb-6 pt-10", className)}
    >
      <h2 className="pb-4 text-center font-heading text-2xl font-bold text-fg/90">Activity</h2>

      <div className="grid w-full grid-cols-[repeat(5,minmax(0,200px))] overflow-y-scroll rounded-3xl px-2 text-sm font-medium">
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
          if (isLoading)
            return (
              <div className="col-span-full flex items-center justify-center py-4">
                <Spinner />
              </div>
            );
          else if (tableRows.length === 0)
            return <p className="col-span-full py-4 text-center">No activity yet.</p>;
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
                    cellIndex === 4 && "rounded-r-md pr-4",
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              )),
            );
          }
        })()}
      </div>
    </Card>
  );
};
