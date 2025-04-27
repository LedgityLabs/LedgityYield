import { Spinner } from "@/components/ui/Spinner";
import { twMerge } from "tailwind-merge";
// Components
import { DepositDialog } from "@/components/app/DepositDialog";
import { WithdrawDialog } from "@/components/app/WithdrawDialog";
import { Amount, Button, Rate } from "@/components/ui";
import { TokenLogo } from "@/components/icons/TokenLogo";
import { getSortIcon } from "@/functions/helpers";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
// Hooks
import { useEffect, useState } from "react";
// Context
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
// Types
import { LTokenInfo } from "@/types";
import { Address } from "viem";

type Pool = {
  underlyingSymbol: string;
  apr: number;
  tvl: number;
  invested: bigint;
  decimals: number;
  lTokenData: LTokenInfo;
};

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
export function AppInvestTokens({ className }: { className?: string }) {
  const {
    lTokenInfosCurrentChain,
    wLTokenInfosCurrentChain,
    tokenInfos,
    tvlMetrics,
  } = useAppDataContext();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState<Pool[]>([]);
  const [openModal, setOpenModal] = useState<"deposit" | "withdraw">();
  const [modalToken, setModalToken] = useState<Address>();

  const lTokenData = lTokenInfosCurrentChain.find(
    (token) => token.address === modalToken,
  );
  const wLTokenData = wLTokenInfosCurrentChain.find(
    (token) =>
      token.address.toLowerCase() === lTokenData?.address.toLowerCase(),
  );
  const underlyingTokenData = tokenInfos.find(
    (token) =>
      token.address.toLowerCase() === lTokenData?.underlying.toLowerCase(),
  );

  function handleSetOpenModal(
    modal: "deposit" | "withdraw",
    token: Address | undefined,
    isOpen: boolean,
  ) {
    if (openModal === modal && !isOpen) {
      setOpenModal(undefined);
      setModalToken(undefined);
      return;
    }

    if (openModal !== modal) {
      setOpenModal(modal);
    }
    if (modalToken !== token) {
      setModalToken(token);
    }
  }

  useEffect(() => {
    const newTableData = lTokenInfosCurrentChain.map((tokenData) => {
      const { symbol, apr, balance, decimals } = tokenData;
      const tokenTvl = tvlMetrics.byToken[symbol] || 0;

      return {
        underlyingSymbol: symbol.slice(1),
        invested: balance,
        tvl: tokenTvl,
        decimals,
        apr: apr,
        //
        lTokenData: tokenData,
      };
    });

    // Update table data only if it has changed
    if (JSON.stringify(tableData) != JSON.stringify(newTableData)) {
      setTableData(newTableData);
      setIsLoading(false);
    }
  }, [lTokenInfosCurrentChain, tokenInfos]);

  /**
   * =============
   * Table Configs
   * =============
   */

  const columnHelper = createColumnHelper<Pool>();

  const columns = [
    columnHelper.accessor("underlyingSymbol", {
      header: "Name",
      cell: (info) => {
        const underlyingSymbol = info.getValue();
        return (
          <div className="inline-flex items-center gap-2.5">
            <TokenLogo
              symbol={underlyingSymbol}
              size={35}
              className="border border-bg/80"
            />
            <p className="text-xl font-bold text-fg/80 min-[480px]:inline hidden">
              {underlyingSymbol}
            </p>
          </div>
        );
      },
    }),
    columnHelper.accessor("apr", {
      header: "APR",
      cell: (info) => (
        <div className="inline-flex items-center gap-2">
          <Rate
            value={info.getValue()}
            className="text-lg font-bold text-primary"
          />
        </div>
      ),
    }),
    columnHelper.accessor("tvl", {
      header: "TVL",
      cell: (info) => {
        const amount = info.getValue();
        return (
          <Amount
            value={amount}
            decimals={0} // already formatted
            prefix={"$ "} // expressed in USD
            displaySymbol={false}
            className="text-lg font-semibold "
          />
        );
      },
    }),
    columnHelper.accessor("invested", {
      header: "Invested",
      cell: (info) => {
        const amount = info.getValue();
        const decimals = info.row.original.decimals;
        const underlyingSymbol = info.row.original.underlyingSymbol;
        return (
          <Amount
            value={amount}
            decimals={decimals}
            suffix={underlyingSymbol}
            displaySymbol={false}
            className="text-lg font-semibold text-fg/90"
          />
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const lTokenData = info.row.original.lTokenData;

        return (
          <div className="flex items-center sm:gap-4 gap-2">
            <Button
              size="small"
              onClick={() =>
                handleSetOpenModal("deposit", lTokenData.address, true)
              }
              className="text-lg inline-flex gap-1 justify-center items-center sm:aspect-auto aspect-square"
            >
              <span className="rotate-90 text-bg/90">
                <i className="ri-login-circle-line" />
              </span>
              <span className="sm:inline-block hidden">Deposit</span>
            </Button>

            <Button
              size="small"
              variant="outline"
              onClick={() =>
                handleSetOpenModal("withdraw", lTokenData.address, true)
              }
              className="text-lg inline-flex gap-1 justify-center items-center sm:aspect-auto aspect-square"
            >
              <span className="rotate-[270deg] text-fg/70">
                <i className="ri-logout-circle-r-line" />
              </span>
              <span className="sm:inline-block hidden">Withdraw</span>
            </Button>
          </div>
        );
      },
    }),
  ];
  const sortableColumns: string[] = [
    // "apr", "tvl", "invested"
  ];

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
  const tableRows = table.getRowModel().rows;

  return (
    <article
      className={`grid w-full md:grid-cols-[repeat(5,auto)] grid-cols-[repeat(4,auto)] border-b border-b-fg/20 ${className}`}
    >
      {headerGroup.headers.map((header, index) => (
        <div
          key={header.id}
          className={twMerge(
            "inline-flex items-center justify-center py-3 bg-fg/5 border-y border-y-fg/10 font-semibold text-fg/50",
            header.column.id === "underlyingSymbol" &&
              "justify-start sm:pl-10 pl-5",
            header.column.id === "invested" && "md:inline-flex hidden",
          )}
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
              {flexRender(header.column.columnDef.header, header.getContext())}
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
        <p className="my-10 block col-span-5 w-full text-center text-lg font-semibold text-fg/60">
          No pools on this chain yet.
        </p>
      )}

      {!isLoading &&
        !!tableRows.length &&
        tableRows.map((row, i) =>
          row.getVisibleCells().map((cell, j) => (
            <div
              key={cell.id}
              className={twMerge(
                "inline-flex items-center justify-center py-6",
                j === 0 && "justify-start sm:pl-10 pl-5",
                i == tableRows.length - 1 && "border-b border-b-fg/20",
                cell.column.id === "invested" && "md:inline-flex hidden",
              )}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          )),
        )}

      <DepositDialog
        isOpen={openModal === "deposit"}
        setIsOpen={(isOpen) =>
          handleSetOpenModal("deposit", lTokenData?.address, isOpen)
        }
        lTokenData={lTokenData}
        wLTokenData={wLTokenData}
        underlyingTokenData={underlyingTokenData}
      />
      <WithdrawDialog
        isOpen={openModal === "withdraw"}
        setIsOpen={(isOpen) =>
          handleSetOpenModal("withdraw", lTokenData?.address, isOpen)
        }
        lTokenData={lTokenData}
        underlyingTokenData={underlyingTokenData}
      />
    </article>
  );
}
