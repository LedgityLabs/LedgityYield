import { FC, useEffect, useState } from "react";
import {
  DateTime,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Spinner,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import { Button } from "@/components/ui";
import {
  SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { LikeIcon, QuoteIcon, ReachIcon, ReplyIcon, RetweetIcon } from "@/lib/icons";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";
import { Toaster } from "@/components/ui/Toaster";

interface Tweet {
  id: string;
  url: string;
  date: string;
  content: string;
  likes: number;
  retweets: number;
  quotes: number;
  replies: number;
  entries: number;
  ingested: boolean;
  rejected: boolean;
  rejectionReason: string;
}

export const AppAirdropTwitter: FC = () => {
  const { data: session } = useSession();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "timestamp",
      desc: true,
    },
  ]);
  const columnHelper = createColumnHelper<Tweet>();
  const [tweetsData, setTweetsData] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const retrieveTweets = async () => {
    if (!isLoading && session) {
      setIsLoading(true);

      // Retrieve tweets
      const req = await fetch(`/api/airdrop/tweets/list`);
      const data = await req.json();
      const tweets = data.data as Tweet[];

      // Populate entries count
      for (const tweet of tweets) {
        tweet.entries =
          tweet.likes * 1 + tweet.retweets * 3 + tweet.replies * 5 + tweet.quotes * 10;
      }

      // Set tweets
      setTweetsData(tweets);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    retrieveTweets();
  }, [session]);

  useEffect(() => {
    retrieveTweets();
  }, []);

  const tweetsColumns = [
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) => {
        return (
          <DateTime
            timestamp={Number.parseInt(info.getValue())}
            output="date"
            className="cursor-help text-slate-300"
          />
        );
      },
    }),
    columnHelper.accessor("content", {
      header: "Content",
      cell: (info) => {
        return (
          <Tooltip>
            <TooltipTrigger>
              <p className="text-fg/80 text-ellipsis">{info.getValue()}</p>
            </TooltipTrigger>
            <TooltipContent>{info.getValue()}</TooltipContent>
          </Tooltip>
        );
      },
    }),
    columnHelper.accessor("likes", {
      // @ts-ignore
      header: <LikeIcon className="w-5 h-5 fill-[#527682]" />,
      cell: (info) => {
        return <p className="text-fg/80">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor("retweets", {
      // @ts-ignore
      header: <RetweetIcon className="w-5 h-5 fill-[#527682]" />,
      cell: (info) => {
        return <p className="text-fg/80">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor("replies", {
      // @ts-ignore
      header: <ReplyIcon className="w-5 h-5 fill-[#527682]" />,
      cell: (info) => {
        return <p className="text-fg/80">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor("quotes", {
      // @ts-ignore
      header: <QuoteIcon className="w-5 h-5 fill-[#527682]" />,
      cell: (info) => {
        return <p className="text-fg/80">{info.getValue()}</p>;
      },
    }),

    columnHelper.accessor("entries", {
      // @ts-ignore
      header: <i className="ri-coupon-2-fill text-lg" />,
      cell: (info) => {
        return <p className="text-fg/80">{info.getValue()}</p>;
      },
    }),
  ];

  const sortableColumns = ["timestamp", "likes", "retweets", "quotes", "replies", "entries"];

  const table = useReactTable({
    data: tweetsData,
    columns: tweetsColumns,
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

  const [tweetURL, setTweetURL] = useState("");

  const handleNewTweet = async () => {
    // Send signature to server
    const req = await fetch("/api/airdrop/tweets/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tweetURL: tweetURL,
      }),
    });

    // If request is successful, update session
    const res = await req.json();
    if (res.success === true) {
      const newTweetsData = [...tweetsData];
      newTweetsData.push({
        id: res.data.id,
        url: res.data.url,
        date: "0",
        likes: 0,
        retweets: 0,
        quotes: 0,
        replies: 0,
        entries: 0,
        content: "",
        ingested: false,
        rejected: false,
        rejectionReason: "",
      });
      setTweetsData(newTweetsData);
      setTweetURL("");
    } else {
      toast({
        title: "Tweet submission error",
        description: res.error,
        variant: "destructive",
      });
    }
  };
  return (
    <DialogContent className="p-0 sm:p-0 sm:pt-10 pt-5 max-w-[700px] border-2 border-[#436874] bg-gradient-to-b from-[#264456]/70 to-[#264456]/90 backdrop-blur-xl before:hidden gap-10 ">
      <div className="overflow-y-scroll scrollbar-thumb-slate-600 scrollbar-track-slate-950/70 scrollbar-thin scrollbar-thumb-rounded max-h-full">
        <div className="flex flex-col sm:gap-12 gap-10 sm:px-10 px-5 ">
          <div className="flex flex-col gap-4">
            <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
              1. Tweet about Multi-Airdrop
              <span className="text-slate-400 text-semibold">, including:</span>
            </h4>
            <p className="font-medium text-slate-300 pl-4 leading-loose">
              <span
                className="bg-[#1579b6] drop-shadow-md text-white font-semibold rounded-xl p-1 px-2 mx-0.5"
                style={{
                  boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.2)",
                  WebkitBoxShadow: "0px 0px 10px 0px rgba(255,255,255,0.2)",
                }}
              >
                #LedgityAirdrop
              </span>{" "}
              <span
                className="bg-[#1579b6] drop-shadow-md text-white font-semibold rounded-xl p-1 px-2 mx-0.5"
                style={{
                  boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.2)",
                  WebkitBoxShadow: "0px 0px 10px 0px rgba(255,255,255,0.2)",
                }}
              >
                #RWA
              </span>{" "}
              <span
                className="bg-[#1579b6] drop-shadow-md text-white font-semibold rounded-xl p-1 px-2 mx-0.5"
                style={{
                  boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.2)",
                  WebkitBoxShadow: "0px 0px 10px 0px rgba(255,255,255,0.2)",
                }}
              >
                #Airdrop
              </span>{" "}
              <span
                className="bg-indigo-500/80 drop-shadow-md text-white font-semibold rounded-xl p-1 px-2 mx-0.5"
                style={{
                  boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.2)",
                  WebkitBoxShadow: "0px 0px 10px 0px rgba(255,255,255,0.2)",
                }}
              >
                @LedgityYield
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
              2. Submit your tweets
            </h4>
            <div className="flex gap-3 items-center px-4">
              <Input
                type="url"
                placeholder="E.g., https://twitter.com/LilaRest/status/..."
                value={tweetURL}
                onChange={(event) => setTweetURL(event.target.value)}
              />
              <Button
                onClick={() => handleNewTweet()}
                className="bg-[#1DA1F2]/70 hover:bg-[#1DA1F2]/50 border-slate-300/70"
              >
                Submit
              </Button>
            </div>
            <div className="flex gap-2 items-center px-4 pl-8">
              <div className="bg-white rounded-full inline-flex justify-center items-center aspect-square">
                <i className="ri-error-warning-fill text-red-500 text-xl leading-none" />
              </div>
              <p className="text-white leading-none">
                Tweet{" "}
                <span className="font-semibold">
                  must have{" "}
                  <span className="inline-flex justify-center items-center gap-0.5">
                    &gt;500 <ReachIcon className="fill-white w-5 h-5 mb-1 inline-block" />
                  </span>
                </span>{" "}
                or it will be <span className="font-semibold">rejected</span>.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
              3. Earn airdrop entries <i className="ri-coupon-2-fill text-slate-400" />
            </h4>
            <div className="flex flex-wrap justify-center text-lg text-center leading-[1.85] text-slate-300 gap-x-10 gap-y-4">
              <span className="inline-flex gap-2 items-center justify-center text-center">
                <span>
                  +1 <i className="ri-coupon-2-fill" />
                </span>{" "}
                per <LikeIcon className="w-6 h-6 fill-[#1DA1F2]/90" />
              </span>
              <span className="inline-flex gap-2 items-center justify-center text-center">
                <span>
                  +3 <i className="ri-coupon-2-fill" />
                </span>{" "}
                per <RetweetIcon className="w-6 h-6 fill-[#1DA1F2]/90" />
              </span>
              <span className="inline-flex gap-2 items-center justify-center text-center">
                <span>
                  +5 <i className="ri-coupon-2-fill" />
                </span>{" "}
                per <ReplyIcon className="w-6 h-6 fill-[#1DA1F2]/90" />
              </span>
              <span className="inline-flex gap-2 items-center justify-center text-center">
                <span>
                  +10 <i className="ri-coupon-2-fill" />
                </span>{" "}
                per <QuoteIcon className="w-6 h-6 fill-[#1DA1F2]/90" />
              </span>
            </div>
          </div>
        </div>

        <div className="w-full max-w-full overflow-x-scroll sm:mt-10 mt-5 scrollbar-thumb-slate-600 scrollbar-track-slate-950/70 scrollbar-thin scrollbar-thumb-rounded">
          <div className="w-full flex-col min-w-[690px]">
            <div className="grid w-full grid-cols-[repeat(7,minmax(0,200px))]">
              {headerGroup.headers.map((header, index) => {
                const content = flexRender(header.column.columnDef.header, header.getContext());
                return (
                  <div
                    key={header.column.id}
                    style={{
                      gridColumnStart: index + 1,
                    }}
                    className="inline-flex items-center justify-center py-3 bg-[#000f17] border-y border-y-[#527682]/80 font-semibold text-[#527682]"
                  >
                    {(sortableColumns.includes(header.column.id) && (
                      <button
                        onClick={() =>
                          header.column.toggleSorting(header.column.getIsSorted() === "asc")
                        }
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
              {(() => {
                const tableRows = table.getRowModel().rows;

                if (isLoading)
                  return (
                    <div className="py-5 flex col-span-7 w-full items-center justify-center border-b border-b-slate-500 font-medium text-slate-300 text-[0.9rem]">
                      <Spinner />
                    </div>
                  );
                else if (tableRows.length === 0)
                  return (
                    <p className="py-5 col-span-7 w-full block text-center text-lg font-semibold text-slate-300 border-b border-b-slate-500 text-[0.9rem]">
                      No tweets yet.
                    </p>
                  );
                else {
                  return tableRows.map((row, rowIndex) => {
                    if (!row.original.ingested)
                      return (
                        <div className="py-5 px-5 flex col-span-7 w-full items-center justify-start text-start border-b border-b-slate-500 font-medium text-slate-300 text-[0.9rem]">
                          <p>
                            <i className="ri-hourglass-2-fill" />{" "}
                            <Link href={row.original.url} className="underline" target="_blank">
                              This tweet
                            </Link>{" "}
                            is being ingested (takes up to 24h)&nbsp;&nbsp;
                            <span className="text-slate-500">ID: {row.original.id}</span>
                          </p>
                        </div>
                      );
                    else if (row.original.rejected)
                      return (
                        <div className="py-5 px-5 flex col-span-7 w-full items-center justify-start text-start border-b border-b-slate-500 font-medium text-slate-300 text-[0.9rem]">
                          <i className="ri-close-circle-line" />
                          &nbsp;
                          <Link href={row.original.url} className="underline" target="_blank">
                            This tweet
                          </Link>
                          &nbsp;has been rejected: {row.original.rejectionReason}
                        </div>
                      );
                    else
                      return row.getVisibleCells().map((cell, cellIndex) => (
                        <div
                          key={cell.id}
                          style={{
                            gridColumnStart: cellIndex + 1,
                          }}
                          className={clsx(
                            "inline-flex items-center justify-center py-3 border-b border-b-slate-500 font-medium text-fg/90 text-[0.9rem]",
                          )}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      ));
                  });
                }
              })()}
            </div>
            <div className="flex justify-center items-center gap-3 py-4">
              <Button
                size="tiny"
                variant="outline"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <i className="ri-arrow-left-line" />
                &nbsp; Prev.
              </Button>
              <Button
                size="tiny"
                variant="outline"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next&nbsp;
                <i className="ri-arrow-right-line" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};
