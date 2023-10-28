import { FC, useEffect, useState } from "react";
import {
  Amount,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Spinner,
  Button,
  Input,
  TokenLogo,
} from "@/components/ui";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import Link from "next/link";
import { useToast } from "@/hooks/useToast";

interface ReferrerData {
  totalReferred: number;
  totalConvertedReferred: number;
  cumulatedReferredDeposits: number;
  averageLockDuration: number;
}

export const AppAirdropReferral: FC = () => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [referrerData, setReferrerData] = useState<ReferrerData | null>(null);
  const { toast } = useToast();

  const retrieveReferrerData = async () => {
    if (!isLoading && session) {
      setIsLoading(true);

      // Retrieve tweets
      const req = await fetch(`/api/airdrop/referral/get`);
      const data = await req.json();

      // Set tweets
      setReferrerData(data.data as ReferrerData);
      setIsLoading(false);
    }
  };

  const copyLink = () => {
    toast({
      title: "Link copied",
      description: "Your referral link has been copied to your clipboard.",
      variant: "default",
    });
  };

  useEffect(() => {
    retrieveReferrerData();
  }, [session]);

  useEffect(() => {
    retrieveReferrerData();
  }, []);

  const progressBarWidth = 50;

  return (
    <DialogContent className="max-w-[650px] border-2 border-[#745a43] bg-gradient-to-b from-[#563c26]/70 to-[#563c26]/90 backdrop-blur-xl before:hidden gap-16 p-10">
      <div className="overflow-y-scroll scrollbar-thumb-slate-600 scrollbar-track-slate-950/70 scrollbar-thin scrollbar-thumb-rounded max-h-full flex flex-col gap-12">
        <div className="flex flex-col gap-6 items-center justify-center">
          <h4 className="text-3xl text-slate-300 font-bold text-center font-heading leading-none">
            Pre-Mining Referral
          </h4>
          <div className="flex justify-center items-center">
            <div className="flex items-center justify-center gap-1 rounded-xl bg-[#30190e] text-orange-50 px-4 py-2 font-medium">
              Up to <span className="text-[#3398ff] font-bold">100,000</span>{" "}
              <TokenLogo size={20} symbol="USDC" /> to be claimed
            </div>
          </div>
        </div>
        {(() => {
          if (!session)
            return (
              <p className="text-slate-100 font-medium text-center text-lg">
                You must log in before.
              </p>
            );
          else if (!referrerData)
            return (
              <p className="text-slate-100 font-medium text-center text-lg h-8 max-h-8">
                <Spinner />
              </p>
            );
          else
            return (
              <>
                <div className="flex flex-col items-start justify-center gap-2">
                  <p className="text-sm text-slate-300 font-medium">Your referral link</p>
                  <div className="flex gap-3 w-full">
                    <Input
                      className="w-full self-stretch inline-block disabled:opacity-90 max-w-[480px]"
                      value={`https://ledgity.finance/app/pre-mining?rId=${session.user.id}`}
                      disabled
                    />
                    <Button
                      className="aspect-square bg-orange-600/80 border-white/80 hover:bg-orange-600/50"
                      onClick={() => copyLink()}
                    >
                      <i className="ri-file-copy-fill" />
                    </Button>
                  </div>
                </div>
                <ul className="flex gap-10 items-center justify-center">
                  <li className="flex flex-col items-center justify-center gap-2 text-slate-100">
                    <p className="text-3xl font-bold font-heading text-center">
                      {referrerData.totalReferred}
                    </p>
                    <p className="text-sm font-medium text-slate-400 text-center">Total referees</p>
                  </li>
                  <li className="flex flex-col items-center justify-center gap-2 text-slate-100">
                    <p className="text-3xl font-bold font-heading text-center">
                      <Amount
                        value={referrerData.cumulatedReferredDeposits}
                        displaySymbol={true}
                        suffix="USDC"
                        decimals={0}
                      />
                    </p>
                    <p className="text-sm font-medium text-slate-400 text-center">
                      Referees deposits
                    </p>
                  </li>
                  <li className="flex flex-col items-center justify-center gap-2 text-slate-100">
                    <p className="text-3xl font-bold font-heading text-center">
                      {referrerData.averageLockDuration.toFixed(0)}mo
                    </p>
                    <p className="text-sm font-medium text-slate-400 text-center">
                      Referees avg. lock
                    </p>
                  </li>
                </ul>

                {/* <div className="flex flex-col max-w-full pt-10">
                  <div className="w-full pt-12 overflow-x-scroll overflow-y-visible pb-4 scrollbar-thumb-slate-600 scrollbar-track-slate-900/50 scrollbar-w-2 scrollbar-h-2 scrollbar scrollbar-thumb-rounded ">
                    <div className="w-full flex flex-col items-center min-w-[900px]">
                      <div className="bg-slate-900 h-4 w-[calc(100%-0.5rem)] mb-2 rounded-sm py-1">
                        <div
                          className="bg-orange-700 h-full rounded-sm relative"
                          style={{
                            width: `${progressBarWidth.toFixed(3)}%`,
                          }}
                        >
                          <div className="absolute -right-[0.55rem] -top-7 flex flex-col items-end">
                            <p className="bg-slate-900 rounded-md p-1 py-0.5 text-xs text-slate-300 absolute left-[calc(100%-16px)] -top-[1.15rem] whitespace-nowrap font-medium font-heading">
                              Your progression
                            </p>
                            <i className="ri-arrow-down-line text-slate-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ul className="flex w-full pb-[22.5px] pt-6 gap-0.5">
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          5k
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          20k
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          50k
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          100k
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          250k
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          500k
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          1M
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          1.5M
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          2M
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          3M
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          4M
                        </p>
                      </div>
                    </li>
                    <li className="w-[calc(100%/12)] relative">
                      <div>
                        <div className="absolute right-0 h-8 -mt-9 border-l-[3px] border-slate-300/50 p-0 w-0 rounded-b-md"></div>
                        <p className="text-slate-300/80 -mt-[1.9rem] text-[0.73rem] text-end font-medium">
                          5M
                        </p>
                      </div>
                    </li>
                  </ul>
                </div> */}
              </>
            );
        })()}
      </div>
    </DialogContent>
  );
};
