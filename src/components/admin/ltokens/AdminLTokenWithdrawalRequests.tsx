// Components
import { AdminBrick } from "@/components/admin/AdminBrick";
import {
  ProcessBigQueuedRequestTx,
  ProcessQueuedRequestsTx,
  RepatriateTx,
} from "@/components/contracts";
import { AddressElement, Amount, Spinner } from "@/components/ui";
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
import {
  useBatchedWithdrawalRequests,
  useLTokenGetExpectedRetained,
  useLTokenUsableUnderlyings,
  useLTokenWithdrawalQueueCursor,
} from "@/hooks/contracts";
import { useEffect, useState } from "react";
// Functions
import { formatUnits, parseUnits } from "viem";
// Types
import { LTokenInfo, TokenInfo } from "@/types";

type WithdrawalRequest = {
  id: bigint;
  amount: bigint;
  account: string;
  isBig: boolean;
};

function getSortIcon(sortOrder: "asc" | "desc" | false): JSX.Element {
  switch (sortOrder) {
    case "asc":
      return <i className="ri-sort-desc"></i>;
    case "desc":
      return <i className="ri-sort-asc"></i>;
    default:
      return <i className="ri-expand-up-down-fill"></i>;
  }
}

export function AdminLTokenWithdrawalRequests({
  tokenData,
  underlyingTokenData,
}: {
  tokenData: LTokenInfo;
  underlyingTokenData: TokenInfo;
}) {
  const queueCursor = useLTokenWithdrawalQueueCursor(tokenData.address);
  const expectedRetained = useLTokenGetExpectedRetained(tokenData.address);
  const usableUnderlyings = useLTokenUsableUnderlyings(tokenData.address);

  const {
    requestsData,
    nbStandardRequests,
    repatriationNeeded,
    repatriationAmount,
    isLoading,
  } = useBatchedWithdrawalRequests(
    tokenData.address,
    queueCursor,
    expectedRetained,
    usableUnderlyings,
    underlyingTokenData,
  );

  /**
   * ==============
   * Table Settings
   * ==============
   */

  const columnHelper = createColumnHelper<WithdrawalRequest>();

  const requestsColumns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => Number(info.getValue()),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => (
        <Amount
          value={info.getValue()}
          decimals={tokenData?.decimals}
          suffix={tokenData?.symbol}
          displaySymbol={false}
        />
      ),
    }),
    columnHelper.accessor("account", {
      header: "Account",
      cell: (info) => (
        <AddressElement
          address={info.getValue() as `0x${string}`}
          copyable={true}
          tooltip={true}
        />
      ),
    }),
    columnHelper.accessor("isBig", {
      header: "Big",
      cell: (info) => {
        if (!info.getValue()) return "No";
        else {
          const requestId = info.row.original.id;
          const requestData = requestsData.find(
            (request) => request.id === requestId,
          );

          if (!requestData || !tokenData || !underlyingTokenData) return <></>;

          const requestAmount = formatUnits(
            requestData.amount,
            underlyingTokenData?.decimals,
          );

          return (
            <ProcessBigQueuedRequestTx
              buttonText="Proccess Big Request"
              contractAddress={tokenData.address}
              params={{ requestId: requestId }}
              approveChecks={[
                {
                  symbol: underlyingTokenData.symbol,
                  amount: requestAmount,
                  spender: tokenData.address,
                  token: underlyingTokenData.address,
                  tokenDecimals: tokenData.decimals,
                },
              ]}
            />
          );
        }
      },
    }),
  ];

  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "id",
      desc: false,
    },
  ]);
  const sortableColumns = ["id", "account", "amount", "isBig"];

  const table = useReactTable({
    data: requestsData,
    columns: requestsColumns,
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
    <AdminBrick
      title="Withdrawal requests"
      className="flex flex-col items-center justify-center p-16 pt-8 [column-span:all;]"
    >
      <div className="flex flex-col gap-5">
        <h4 className="font-heading text-xl font-bold">Actions needed</h4>

        {isLoading && (
          <div className="my-10 flex w-full items-center justify-center">
            <Spinner />
          </div>
        )}

        {!isLoading && (
          <ul className="-mt-2 mb-5 flex list-inside list-disc flex-col gap-2 pl-5">
            <li>
              <div className="inline-flex items-center gap-3 text-lg">
                {!nbStandardRequests ? (
                  <span className="text-fg/50">All requests processed.</span>
                ) : (
                  <p className="text-lg">
                    There are{" "}
                    <span className="font-bold">{nbStandardRequests}</span>{" "}
                    standard requests awaiting processing
                  </p>
                )}

                <ProcessQueuedRequestsTx
                  buttonText="Process all requests"
                  contractAddress={tokenData.address}
                />
              </div>
            </li>

            <li>
              <div className="inline-flex items-center gap-3 text-lg">
                {repatriationNeeded ? (
                  <>
                    <p>
                      <Amount
                        value={parseUnits(
                          repatriationAmount,
                          underlyingTokenData.decimals,
                        )}
                        decimals={underlyingTokenData.decimals}
                        suffix={underlyingTokenData.symbol}
                        className="font-bold"
                      />{" "}
                      are missing to process all non-big requests:
                    </p>
                    <RepatriateTx
                      buttonText="Repatriate"
                      contractAddress={tokenData.address}
                      disabled={!repatriationAmount}
                      params={{
                        symbol: tokenData.symbol,
                        amount: repatriationAmount,
                        tokenDecimals: tokenData.decimals,
                      }}
                      approveChecks={[
                        {
                          symbol: underlyingTokenData.symbol,
                          token: tokenData.underlying,
                          tokenDecimals: underlyingTokenData.decimals,
                          spender: tokenData.address,
                          amount: repatriationAmount,
                        },
                      ]}
                    />
                  </>
                ) : (
                  <span className="text-fg/50">No repatriation needed.</span>
                )}
              </div>
            </li>

            <li>
              <div className="inline-flex items-center gap-3 text-lg">
                {requestsData.length - nbStandardRequests > 0 ? (
                  <p>
                    <span className="font-bold">
                      {requestsData.length - nbStandardRequests}
                    </span>{" "}
                    big requests to process.
                  </p>
                ) : (
                  <span className="text-fg/50">No big request to process.</span>
                )}
              </div>
            </li>
          </ul>
        )}
        <h4 className="font-heading text-xl font-bold">
          Requests queue ({requestsData.length})
        </h4>
        <div className="grid grid-cols-[repeat(4,minmax(0,200px))] border-b border-b-fg/20 ">
          {headerGroup.headers.map((header, index) => (
            <div
              key={header.column.id}
              style={{
                gridColumnStart: index + 1,
              }}
              className="inline-flex items-center justify-center border-y border-y-fg/10 bg-fg/5 py-3 font-semibold text-fg/50"
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
            <div className="col-span-4 my-10 flex w-full items-center justify-center">
              <Spinner />
            </div>
          )}

          {!isLoading && !tableRows.length && (
            <p className="col-span-4 my-10 block w-full text-center text-lg font-semibold text-fg/60">
              No requests yet.
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
                  className={`inline-flex items-center justify-center border-b border-b-fg/20 py-3 text-[0.9rem] text-lg font-medium text-fg/90 ${i + 1 == tableRows.length ? "border-b-0" : ""}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              )),
            )}
        </div>
      </div>
    </AdminBrick>
  );
}
