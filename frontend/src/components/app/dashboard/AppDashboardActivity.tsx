import React, { FC, useEffect, useState, useCallback, useMemo } from "react";
import {
  Card,
  DateTime,
  Button,
  Spinner,
  Amount,
} from "@/components/ui";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAccount } from "wagmi";
import clsx from "clsx";

interface Activity {
  id: string;
  requestId: string;
  timestamp: string;
  action: string;
  amount: string;
  amountAfterFees: string;
  status: string;
  ltoken: {
    symbol: string;
    decimals: number;
  };
  chainId?: number;
}

const SUPPORTED_NETWORKS = {
  42161: {
    name: 'Arbitrum',
    endpoint: process.env.NEXT_PUBLIC_ARBITRUM_SUBGRAPH_URL || '',
    prefix: ''
  },
  59144: {
    name: 'Linea',
    endpoint: process.env.NEXT_PUBLIC_LINEA_SUBGRAPH_URL || '',
    prefix: ''
  },
  8453: {
    name: 'Base',
    endpoint: process.env.NEXT_PUBLIC_BASE_SUBGRAPH_URL || '',
    prefix: ''
  }
};

export const AppDashboardActivity: FC<React.ComponentPropsWithoutRef<typeof Card>> = ({ className }) => {
  const { address, chainId } = useAccount();
  const [sorting, setSorting] = useState<SortingState>([{ id: "timestamp", desc: true }]);
  const [activityData, setActivityData] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const columnHelper = createColumnHelper<Activity>();

  const getNetworkConfig = useCallback((chainId?: number) => {
    if (!chainId) return null;
    return SUPPORTED_NETWORKS[chainId as keyof typeof SUPPORTED_NETWORKS];
  }, []);

  const querySubgraph = useCallback(async (endpoint: string, query: string) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }, []);

  const fetchActivityData = useCallback(async () => {
    if (!address) {
      setError("Please connect your wallet");
      setIsLoading(false);
      return;
    }

    const network = getNetworkConfig(chainId);
    if (!network) {
      setError("Please connect to a supported network");
      setIsLoading(false);
      return;
    }

    if (!network.endpoint) {
      setError(`Subgraph endpoint not configured for ${network.name}`);
      setIsLoading(false);
      return;
    }

    try {
      const healthQuery = `
        {
          _meta {
            block {
              number
            }
            deployment
            hasIndexingErrors
          }
        }
      `;

      const healthResult = await querySubgraph(network.endpoint, healthQuery);

      if (!healthResult.data?._meta?.block) {
        throw new Error('Subgraph health check failed');
      }

      const query = `
        {
          activities(
            where: { account: "${address.toLowerCase()}" }
            orderBy: timestamp
            orderDirection: desc
            first: 1000
          ) {
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
      `;

      const result = await querySubgraph(network.endpoint, query);

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const activities = result.data?.activities;

      if (Array.isArray(activities)) {
        if (activities.length > 0) {
          const enrichedActivities = activities.map(activity => ({
            ...activity,
            chainId,
          }));
          setActivityData(enrichedActivities);
          setError(null);
        } else {
          setActivityData([]);
          setError(`No activity found for your account on ${network.name}`);
        }
      } else {
        throw new Error('Invalid response structure from subgraph');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to load activity data: ${errorMessage}`);
      setActivityData([]);
    } finally {
      setIsLoading(false);
    }
  }, [address, chainId, getNetworkConfig, querySubgraph]);

  useEffect(() => {
    fetchActivityData();
  }, [fetchActivityData]);

  const columns = useMemo(() => [
    columnHelper.accessor("timestamp", {
      header: "Date",
      cell: (info) => (
        <DateTime
          timestamp={Number(info.getValue()) * 1000}
          output="date"
          className="cursor-help text-fg/50"
        />
      ),
    }),
    columnHelper.accessor("action", {
      header: "Action",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("ltoken.symbol", {
      header: "L-Token",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => {
        const row = info.row.original;
        return (
          <Amount
            value={BigInt(row.amount)}
            decimals={row.ltoken.decimals}
            suffix={row.ltoken.symbol}
            displaySymbol={false}
            tooltipChildren={
              row.amount !== row.amountAfterFees && (
                <span>
                  <span className="font-medium opacity-80">After fees: </span>
                  <Amount
                    tooltip={false}
                    value={BigInt(row.amountAfterFees)}
                    decimals={row.ltoken.decimals}
                    suffix={row.ltoken.symbol}
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
        return (
          <div className="flex items-center gap-1.5">
            <div
              className={clsx(
                "block h-3 w-3 rounded-full border-2",
                ["Fulfilled", "Success"].includes(status) && "border-emerald-500 bg-emerald-200",
                status === "Queued" && "border-amber-500 bg-amber-200",
                status === "Cancelled" && "border-red-500 bg-red-200"
              )}
            />
            <span
              className={clsx(
                "font-semibold",
                ["Fulfilled", "Success"].includes(status) && "text-emerald-500",
                status === "Queued" && "text-amber-500",
                status === "Cancelled" && "text-red-500"
              )}
            >
              {status}
            </span>
          </div>
        );
      },
    }),
  ], [columnHelper]);

  const table = useReactTable({
    data: activityData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  useEffect(() => {
    if (table) {
      table.setPageSize(10);
    }
  }, [table]);

  const currentNetwork = useMemo(() => getNetworkConfig(chainId), [chainId, getNetworkConfig]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner />
        <span className="ml-3">Loading activities...</span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4 text-center text-sm">
        <div className="text-fg/60">
          {currentNetwork ? `Connected to ${currentNetwork.name}` : 'Unsupported Network'}
        </div>
        <div className="text-xs text-fg/40 mt-1">
          {address && `${address.slice(0, 6)}...${address.slice(-4)}`}
        </div>
      </div>

      {error ? (
        <div className="text-center p-8">
          <div className="text-fg/60 font-semibold mb-2">
            {error}
          </div>
          <div className="text-fg/40 text-sm">
            Supported networks: {Object.values(SUPPORTED_NETWORKS).map(n => n.name).join(', ')}
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="p-3 text-left bg-fg/5 border-y border-y-fg/10 font-semibold text-fg/50"
                      >
                        {header.column.getCanSort() ? (
                          <button
                            className="flex items-center gap-1"
                            onClick={() => header.column.toggleSorting()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span>
                              {header.column.getIsSorted() === "asc" ? (
                                <i className="ri-sort-desc" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <i className="ri-sort-asc" />
                              ) : (
                                <i className="ri-expand-up-down-fill" />
                              )}
                            </span>
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="p-3 border-b border-b-fg/20 font-medium text-fg/90"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center gap-3 py-4">
            <Button
              size="tiny"
              variant="outline"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <i className="ri-arrow-left-line" />
              &nbsp; Newer
            </Button>
            <Button
              size="tiny"
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Older&nbsp;
              <i className="ri-arrow-right-line" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default AppDashboardActivity;