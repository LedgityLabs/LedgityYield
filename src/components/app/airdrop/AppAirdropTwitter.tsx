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
import { LikeIcon, QuoteIcon, ReplyIcon, RetweetIcon } from "@/lib/icons";
import Link from "next/link";

interface Tweet {
  tweetId: string;
  timestamp: string;
  content: string;
  likes: number;
  retweets: number;
  quotes: number;
  replies: number;
  entries: number;
  ingested: boolean;
  rejected: boolean;
  rejectedReason: string;
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
      header: <LikeIcon className="w-5 h-5 fill-slate-500" />,
      cell: (info) => {
        return <p className="text-fg/80">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor("retweets", {
      // @ts-ignore
      header: <RetweetIcon className="w-5 h-5 fill-slate-500" />,
      cell: (info) => {
        return <p className="text-fg/80">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor("replies", {
      // @ts-ignore
      header: <ReplyIcon className="w-5 h-5 fill-slate-500" />,
      cell: (info) => {
        return <p className="text-fg/80">{info.getValue()}</p>;
      },
    }),
    columnHelper.accessor("quotes", {
      // @ts-ignore
      header: <QuoteIcon className="w-5 h-5 fill-slate-500" />,
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

  const sortableColumns = [
    "timestamp",
    "views",
    "likes",
    "retweets",
    "quotes",
    "replies",
    "entries",
  ];

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
    const data = await req.json();
    if (data.success === true) {
      const newTweetsData = [...tweetsData];
      newTweetsData.push({
        tweetId: data.data.tweetId,
        timestamp: "0",
        likes: 0,
        retweets: 0,
        quotes: 0,
        replies: 0,
        entries: 0,
        content: "",
        ingested: false,
        rejected: false,
        rejectedReason: "",
      });
      setTweetsData(newTweetsData);
    }
  };
  return (
    <DialogContent className="p-0 sm:pt-10 pt-5 max-w-[700px] bg-gradient-to-br from-slate-700 to-slate-800 before:hidden border-2 border-slate-500">
      <div className="flex flex-col gap-5 sm:px-10 px-5">
        <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
          1. Tweet about Multi-Airdrop
        </h4>
        <div className="flex flex-col gap-3">
          <p className="font-medium text-slate-300 pl-4">To be valid your tweet must:</p>
          <ul className="list-disc pl-9 flex flex-col gap-3 font-medium text-slate-300">
            <li>
              Include{" "}
              <span className="bg-primary/80 font-semibold rounded-xl p-1 px-2 mx-0.5">
                #LedgityAirdrop
              </span>{" "}
              <span className="bg-primary/80 font-semibold rounded-xl p-1 px-2 mx-0.5">#RWA</span>{" "}
              <span className="bg-primary/80 font-semibold rounded-xl p-1 px-2 mx-0.5">
                #Airdrop
              </span>{" "}
              <span className="bg-primary/80 font-semibold rounded-xl p-1 px-2 mx-0.5">#LDY</span>
            </li>
            <li>
              Mention <span className="bg-orange-700/80 rounded-xl p-1 px-2">@LedgityYield</span>
            </li>
          </ul>
        </div>

        <Button
          size="small"
          className="bg-[#1DA1F2]/90 hover:opacity-80 transition-opacity w-min gap-1.5 items-center border-slate-300/70 text-[0.92rem] px-2.5 py-0.5 border-2 h-10 self-center"
        >
          <i className="ri-twitter-fill text-[1.17rem] " /> Tweet now{" "}
          <i className="ri-arrow-right-line" />
        </Button>
        <br />
        <br />
        <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
          2. Submit tweets to earn <i className="ri-coupon-2-fill" />
        </h4>
        <p className="leading-loose font-medium text-slate-300 pl-4">
          To be accepted your tweet must:
          <ol className="list-decimal pl-9">
            <li>
              have <span className="font-semibold">at least 500 views</span>
            </li>
            <li>
              have <span className="font-semibold">at least 10 interactions</span>
            </li>
          </ol>
        </p>
        <div className="flex gap-3 items-center">
          <Input
            type="url"
            placeholder="E.g., https://twitter.com/LilaRest/status/..."
            onChange={(event) => setTweetURL(event.target.value)}
          />
          <Button onClick={() => handleNewTweet()}>Submit</Button>
        </div>
      </div>

      <div className="w-full flex-col">
        <div className="grid w-full grid-cols-[repeat(7,minmax(0,200px))]">
          {headerGroup.headers.map((header, index) => {
            const content = flexRender(header.column.columnDef.header, header.getContext());
            return (
              <div
                key={header.column.id}
                style={{
                  gridColumnStart: index + 1,
                }}
                className="inline-flex items-center justify-center py-3 bg-fg border-y border-y-slate-600 font-semibold text-slate-500"
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
                <div className="py-5 flex col-span-7 w-full items-center justify-center border-b border-b-fg/20 font-medium text-fg/90 text-[0.9rem]">
                  <Spinner />
                </div>
              );
            else if (tableRows.length === 0)
              return (
                <p className="py-5 col-span-7 w-full block text-center text-lg font-semibold text-fg/60 border-b border-b-fg/20 text-[0.9rem]">
                  No tweets yet.
                </p>
              );
            else {
              return tableRows.map((row, rowIndex) => {
                if (!row.original.ingested)
                  return (
                    <div className="py-5 flex col-span-7 w-full items-center justify-center border-b border-b-fg/20 font-medium text-fg/90 text-[0.9rem]">
                      <p>
                        <i className="ri-hourglass-2-fill" /> Tweet being ingested, can take up to
                        24h.{" "}
                        <Link
                          href={`https://twitter.com/status/${row.original.tweetId}`}
                          className="underline"
                        >
                          See tweet <i className="ri-arrow-right-line" />
                        </Link>
                      </p>
                    </div>
                  );
                else if (row.original.rejected)
                  return (
                    <div className="py-5 flex col-span-7 w-full items-center justify-center border-b border-b-fg/20 font-medium text-fg/90 text-[0.9rem]">
                      <i className="ri-close-circle-line" /> Rejected. Reason: Tweet doesn&apos;t
                      belong to you.
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
                        "inline-flex items-center justify-center py-3 border-b border-b-fg/20 font-medium text-fg/90 text-[0.9rem]",
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
    </DialogContent>
  );
};
