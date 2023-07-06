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
import { usePublicClient, useWalletClient } from "wagmi";
import { LTokenId } from "../../../../hardhat/deployments";
import { useContractAddress } from "@/hooks/useContractAddress";
import {
  useLTokenDecimals,
  useLTokenWithdrawalRequestAmount,
  usePrepareLTokenCancelWithdrawalRequest,
} from "@/generated";

const CancelButton: FC<{ ltokenId: LTokenId; requestId: bigint }> = ({ ltokenId, requestId }) => {
  const ltokenAddress = useContractAddress(ltokenId);
  const { data: decimals } = useLTokenDecimals({
    address: ltokenAddress,
  });
  const { data: amount } = useLTokenWithdrawalRequestAmount({
    address: ltokenAddress,
    args: [requestId],
    watch: true,
  });
  const preparation = usePrepareLTokenCancelWithdrawalRequest({
    address: ltokenAddress,
    args: [requestId],
  });

  useEffect(() => {
    preparation.refetch();
  }, [amount]);
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild className="absolute -inset-y-1 inset-x-0">
          <AlertDialogTrigger asChild>
            <Button
              size="tiny"
              variant="destructive"
              className="w-full h-full rounded-lg opacity-0 transition-opacity flex justify-center items-center hover:opacity-100 hover:bg-opacity-100"
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
            <span className="font-semibold">you will loose your current position</span> in the withdrawal
            queue.
            <br />
            <br />
            By cancelling this request{" "}
            <span className="font-semibold">
              you will receive your <Amount value={amount} decimals={decimals} /> {ltokenId}{" "}
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
      const decimalsMap = new Map<string, number>();
      execute(
        `
      {
        activities(where: { account: "${walletClient.account.address}" }) {
          id
          ltoken {
            symbol
            decimals
          }
          timestamp
          action
          amount
          status
        }
      }
    `,
        {}
      ).then(
        (result: {
          data: {
            activities: Activity[];
          };
        }) => {
          setActivityData(result.data.activities);
          setIsLoading(false);
        }
      );
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
            className="cursor-help text-fg/50 font-normal"
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
        const amount = info.getValue();
        const ltoken = info.row.getValue("ltoken") as LToken;
        return (
          <Amount
            value={amount}
            decimals={ltoken.decimals}
            suffix={ltoken.symbol}
            displaySymbol={false}
          />
        );
      },
    }),

    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        const ltoken = info.row.getValue("ltoken") as LToken;
        const requestId = activityData[info.row.index].id;
        console.log(requestId);
        return (
          <div className="relative flex items-center gap-1.5 [&:hover_>_button]:opacity-100">
            <div
              className={clsx(
                "block w-3 h-3 aspect-square border-2 rounded-full",
                ["Fulfilled", "Success"].includes(status) && "bg-emerald-200 border-emerald-500",
                status === "Queued" && "bg-amber-200 border-amber-500",
                status === "Cancelled" && "bg-red-200 border-red-500"
              )}
            ></div>
            <div
              className={clsx(
                "font-semibold flex gap-2 justify-center items-center",
                ["Fulfilled", "Success"].includes(status) && "text-emerald-500",
                status === "Queued" && "text-amber-500",
                status === "Cancelled" && "text-red-500"
              )}
            >
              <p>{status}</p>
            </div>
            {status === "Queued" && (
              <CancelButton ltokenId={ltoken.symbol as LTokenId} requestId={BigInt(requestId)} />
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
      className={twMerge("flex flex-col items-center px-4 pt-10 pb-6", className)}
    >
      <h2 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">Activity</h2>

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
          if (isLoading)
            return (
              <div className="col-span-full py-4 flex justify-center items-center">
                <Spinner />
              </div>
            );
          else if (tableRows.length === 0)
            return <p className="col-span-full text-center py-4">Nothing yet.</p>;
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
