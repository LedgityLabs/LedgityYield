import {
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Spinner,
} from "@/components/ui";
import {
  AffiliateActivityResponse,
  searchAffiliateActivity,
  SearchAffiliateActivityParams,
  SearchAffiliateActivityResponse,
} from "@/services/api/searchAffiliateActivity";
import { FC, useEffect, useState } from "react";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useAccount, useChainId, useSignMessage } from "wagmi";
import { getLastCommissionPercent } from "@/services/api/getLastCommissionPercent";
import { createCommission } from "@/services/api/crateCommission";
import { zeroAddress } from "viem";
import { signInAffiliate } from "@/services/api/signInAffiliateAPI";
import { useLocalStorage } from "usehooks-ts";

export const AdminDashboard: FC = () => {
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [affiliateCode, setAffiliateCode] = useState<string>("");
  const [searchYear, setSearchYear] = useState<number>(new Date().getFullYear());
  const [searchQuarter, setSearchQuarter] = useState<number>(new Date().getMonth() / 3 + 1);
  const searchYearList = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);
  const quarterList = Array.from({ length: 4 }, (_, i) => i + 1);

  const [searchResult, setSearchResult] = useState<SearchAffiliateActivityResponse>();
  const [tableRows, setTableRows] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "walletAddress",
      desc: false,
    },
  ]);
  const [commissionPercent, setCommissionPercent] = useState<number>(0);
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [commissionStatusInfo, setCommissionStatusInfo] = useState<{
    isSuccess: boolean;
    statusMessage?: string;
  }>({ isSuccess: false, statusMessage: undefined });

  const [authTokenInfo, setAuthTokenInfo] = useLocalStorage<{ token?: string; exp?: string }>(
    "authTokenInfo",
    { token: undefined, exp: undefined },
  );

  const { signMessageAsync } = useSignMessage();
  const account = useAccount();
  const chainId = useChainId();

  const handleSignIn = async () => {
    const rawMessage = `Welcome to the Affiliate Program! Your wallet address is ${account.address}.`;
    const signature = await signMessageAsync({ message: rawMessage });
    const signResult = await signInAffiliate({
      chainId,
      walletAddress: account.address || zeroAddress,
      rawMessage,
      signedMessage: signature,
    });
    if (signResult.isSuccess) {
      setIsSignedIn(true);
      setAuthTokenInfo({ token: signResult.token, exp: signResult.exp });
      setCommissionStatusInfo({ isSuccess: true, statusMessage: undefined });
    } else {
      setIsSignedIn(false);
      setCommissionStatusInfo({ isSuccess: false, statusMessage: signResult.message || "" });
    }
  };

  const handleSetCommission = async () => {
    if (!authTokenInfo.token || !authTokenInfo.exp) {
      setIsSignedIn(false);
      setCommissionStatusInfo({
        isSuccess: false,
        statusMessage: "Auth token not found, Signin again!",
      });
      return;
    }
    if (commissionPercent < 0 || commissionPercent > 100) {
      setCommissionStatusInfo({
        isSuccess: false,
        statusMessage: "Commission % should be between 0 and 100",
      });
      return;
    }
    const currentTimeStamp = new Date().getTime() / 1000;
    if (Number(authTokenInfo.exp) < currentTimeStamp) {
      setIsSignedIn(false);
      setCommissionStatusInfo({
        isSuccess: false,
        statusMessage: "Auth token expired, Signin again!",
      });
      return;
    }
    const result = await createCommission(commissionPercent, authTokenInfo.token);
    if (result.isSuccess) {
      setCommissionStatusInfo({ isSuccess: true, statusMessage: result.message });
      setCommissionPercent(result.percent!);
    } else {
      setCommissionStatusInfo({ isSuccess: false, statusMessage: result.message });
    }
  };

  const handleSearch = async () => {
    const searchParams: SearchAffiliateActivityParams = {
      searchYear,
      searchQuarter,
    };
    if (walletAddress && walletAddress.length) searchParams["walletAddress"] = walletAddress;
    if (affiliateCode && affiliateCode.length) searchParams["affiliateCode"] = affiliateCode;
    setIsLoading(true);
    setTableRows([]);
    const result = await searchAffiliateActivity(searchParams);
    setSearchResult(result);
    setIsLoading(false);
  };

  const columnHelper = createColumnHelper<AffiliateActivityResponse>();
  const requestsColumns = [
    columnHelper.accessor("walletAddress", {
      header: "Affilate Account",
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("code", {
      header: "Affiliate Code",
      cell: (info) => <span className="text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: (info) => <span className="text-sm">{Number(info.getValue())}</span>,
    }),
    columnHelper.accessor("commissionAmount", {
      header: "Commission Amount",
      cell: (info) => <span className="text-sm">{Number(info.getValue())}</span>,
    }),
  ];

  const sortableColumns = ["walletAddress", "code", "amount", "commissionAmount"];
  const table = useReactTable({
    data: searchResult?.data || [],
    columns: requestsColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Get only header group
  const headerGroup = table.getHeaderGroups()[0];

  // Set page size
  useEffect(() => {
    table.setPageSize(10);
    const currentTimeStamp = new Date().getTime() / 1000;
    if (authTokenInfo.token && authTokenInfo.exp && Number(authTokenInfo.exp) > currentTimeStamp) {
      setIsSignedIn(true);
    }
    getLastCommissionPercent().then((res) => {
      setCommissionPercent(res);
    });
  }, []);

  useEffect(() => {
    const { rows } = table.getRowModel();
    setTableRows(rows);
  }, [searchResult]);

  return (
    <Card className="lg:w-[1080px] flex flex-col gap-5 w-full h-full p-10">
      <h3 className="justify-center text-center font-bold text-2xl font-heading text-fg/90">
        Affiliate Dashboard
      </h3>
      <Card className="w-full grid grid-cols-12 p-6 gap-2" animated={false}>
        <div className="w-full col-span-12 xl:col-span-6">
          {isSignedIn && (
            <Input
              type="number"
              placeholder="Set Commission %"
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(Number(e.target.value))}
              disableDefaultCss={true}
              className="flex items-center content-center w-full p-2 py-3 rounded-lg"
            />
          )}
          {!isSignedIn && (
            <span className="flex content-center items-center w-full h-full p-2 py-3 border-1 border-gray-800 rounded-lg text-black text-xl font-semibold">
              {`Current Commission: ${commissionPercent}%`}
            </span>
          )}
        </div>
        <Button
          size="medium"
          onClick={() => {
            isSignedIn ? handleSetCommission() : handleSignIn();
          }}
          className="w-full bg-primary text-white col-span-12 xl:col-span-6"
        >
          {isSignedIn ? "Set Commission %" : "Sign In"}
        </Button>
        <div className="col-span-12 flex justify-center">
          {commissionStatusInfo.statusMessage && (
            <span
              className={clsx(
                commissionStatusInfo.isSuccess ? "bg-green-600" : "bg-red-500",
                "font-semibold border rounded-lg p-2 text-white",
              )}
            >
              {commissionStatusInfo.statusMessage}
            </span>
          )}
        </div>
      </Card>
      <Card className="w-full p-6 grid grid-cols-12 gap-5" animated={false}>
        <div className="flex flex-col col-span-12 xl:col-span-4 gap-2">
          <h4 className="text-xl">Affiliate User</h4>
          <Input
            placeholder="Affiliate Wallet Address"
            value={walletAddress}
            onChange={(e) => (setWalletAddress ? setWalletAddress(e.target.value) : null)}
            disableDefaultCss={true}
            className="w-full p-2 py-3 rounded-lg"
          />
          <Input
            placeholder="Affiliate Code"
            value={affiliateCode}
            onChange={(e) => (setAffiliateCode ? setAffiliateCode(e.target.value) : null)}
            disableDefaultCss={true}
            className="w-full p-2 py-3 rounded-lg"
          />
        </div>
        <div className="flex flex-col col-span-12 xl:col-span-4 gap-2">
          <h4 className="text-xl">Search Period</h4>
          <Select
            onValueChange={(value) => setSearchYear(Number(value))}
            value={searchYear.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              {searchYearList.map((year) => (
                <SelectItem value={year.toString()} key={year}>
                  <div className="flex w-full justify-center items-center">
                    <p className="font-semibold sm:inline hidden">{year}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            onValueChange={(value) => setSearchQuarter(Number(value))}
            value={searchQuarter.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Quarter" />
            </SelectTrigger>
            <SelectContent className="h-10">
              {quarterList.map((quarter) => (
                <SelectItem value={quarter.toString()} key={quarter} className="h-10">
                  <div className="flex w-full justify-center items-center">
                    <p className="font-semibold sm:inline hidden">{quarter}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid col-span-12 xl:col-span-4 gap-2 content-end">
          <Button size="medium" onClick={handleSearch} className="w-full bg-primary text-white">
            Search
          </Button>
        </div>
        <div className="col-span-12 flex justify-center">
          {searchResult && !searchResult?.isSuccess && (
            <span className="font-semibold border rounded-lg p-2 bg-red-500 text-white">
              {searchResult?.message}
            </span>
          )}
        </div>
      </Card>
      <div className="grid border-b border-b-fg/20 w-full">
        {headerGroup.headers.map((header, index) => {
          const content = flexRender(header.column.columnDef.header, header.getContext());
          return (
            <div
              key={header.column.id}
              style={{
                gridColumnStart: index + 1,
              }}
              className="inline-flex items-center justify-center border-y border-y-fg/10 bg-fg/5 py-3 font-semibold text-fg/50"
            >
              {(sortableColumns.includes(header.column.id) && (
                <button
                  onClick={() => header.column.toggleSorting(header.column.getIsSorted() === "asc")}
                  className="flex items-center gap-1"
                >
                  {content}
                  <span>
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
        {isLoading && (
          <div className="col-span-4 my-10 flex w-full items-center justify-center">
            <Spinner />
          </div>
        )}
        {!isLoading && tableRows.length === 0 && (
          <p className="col-span-4 my-10 block w-full text-center text-lg font-semibold text-fg/60">
            No Search Result
          </p>
        )}
        {tableRows.map((row, rowIndex) =>
          row.getVisibleCells().map((cell: any, cellIndex: number) => {
            return (
              <div
                key={cell.id}
                style={{
                  gridColumnStart: cellIndex + 1,
                }}
                className={clsx(
                  "inline-flex items-center justify-center border-b border-b-fg/20 py-3 text-[0.9rem] text-lg font-medium text-fg/90",
                  rowIndex == tableRows.length - 1 && "border-b-0",
                )}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            );
          }),
        )}
      </div>
    </Card>
  );
};
