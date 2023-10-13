import {
  Button,
  DaysUntil,
  Dialog,
  DialogTrigger,
  Spinner,
  TokenLogo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import zealyIcon from "~/assets/partners/zealy-icon.svg";
import { useSession, signIn, signOut } from "next-auth/react";
import { twMerge } from "tailwind-merge";
import { AppAirdropTwitter } from "./AppAirdropTwitter";
import { LikeIcon, QuoteIcon, ReplyIcon, RetweetIcon } from "@/lib/icons";
import { createPortal } from "react-dom";
import clsx from "clsx";
import bronzeBadge from "~/assets/airdrop/ranks/bronze.png";
import silverBadge from "~/assets/airdrop/ranks/silver.png";
import goldBadge from "~/assets/airdrop/ranks/gold.png";
import eliteBadge from "~/assets/airdrop/ranks/elite.png";
import rubyBadge from "~/assets/airdrop/ranks/ruby.png";
import titanBadge from "~/assets/airdrop/ranks/titan.png";
import legendBadge from "~/assets/airdrop/ranks/legend.png";
import secretBadge from "~/assets/airdrop/ranks/secret.png";

interface PointsData {
  success: boolean;
  twitterUsername: string;
  image: string;
  league: string;
  rank: number;
  zealyPoints: number;
  twitterPoints: number;
  galxePoints: number;
  preMiningPoints: number;
  totalPoints: number;
  lastUpdated: number;
  walletAddress: string;
}

export const AppAirdrop: FC = () => {
  const { data: walletClient } = useWalletClient();
  const { data: userSession, status: userStatus, update: updateSession } = useSession();
  const [pointsData, setPointsData] = useState<PointsData>();
  const [shownLeague, setShownLeague] = useState("bronze");
  const [leagueData, setLeagueData] = useState<{
    data: {
      twitterUsername: string;
      image: string;
      totalPoints: number;
    }[];
  }>();
  const [leagueDataIsLoading, setLeagueDataIsLoading] = useState(false);

  // Retrieves quests leaderboards data
  const retrievePointsData = async () => {
    const res = await fetch("/api/airdrop/points/user");
    if (!res.ok) {
      setPointsData(undefined);
      throw new Error("Failed to fetch points data.");
    }
    setPointsData(await res.json());
  };

  useEffect(() => {
    if (userSession && userSession.user.walletAddress) retrievePointsData();
  }, [userSession]);

  // Retrieve league's data
  const handleLeagueChange = async () => {
    if (leagueDataIsLoading) return;
    setLeagueDataIsLoading(true);
    setLeagueData(undefined);
    const res = await fetch(`/api/airdrop/points/leaderboard?league=${shownLeague}`);
    if (!res.ok) {
      setLeagueData(undefined);
      setLeagueDataIsLoading(false);
      throw new Error("Failed to fetch leaderboard data.");
    }
    setLeagueData(await res.json());
    setLeagueDataIsLoading(false);
  };

  useEffect(() => {
    handleLeagueChange();
  }, [shownLeague]);

  // Compute wallet missing points
  const walletMissingPoints = pointsData ? 20000 - pointsData.totalPoints : 0;

  // Handles wallet linking to Twitter account
  const handleSignature = async () => {
    // Generate message
    const req = await fetch("/api/airdrop/wallet/generate-message");
    const { message } = await req.json();

    // Request wallet signature
    const signature = await walletClient?.signMessage({
      message,
    });

    // Send signature to server
    const req2 = await fetch("/api/airdrop/wallet/verify-signature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        walletAddress: walletClient?.account.address,
        signature,
      }),
    });

    // If request is successful, update session
    const data = await req2.json();
    if (data.success === true) {
      await updateSession({
        walletAddress: walletClient?.account.address,
      });
    }
  };

  // Determine whether the user is authenticated
  const isAuthenticated = Boolean(
    userStatus === "authenticated" && userSession?.user.walletAddress,
  );

  // Compute progress bar width
  let progressBarWidth = 0.05; // Min-width to 0.05% width
  if (pointsData && pointsData.totalPoints > 20_000) {
    if (pointsData.totalPoints < 50000)
      progressBarWidth = 12.5 * ((pointsData.totalPoints - 20_000) / 30_000);
    else if (pointsData.totalPoints < 100_000)
      progressBarWidth = 12.5 + 12.5 * ((pointsData.totalPoints - 50_000) / 50_000);
    else if (pointsData.totalPoints < 200_000)
      progressBarWidth = 25 + 12.5 * ((pointsData.totalPoints - 100_000) / 100_000);
    else if (pointsData.totalPoints < 500_000)
      progressBarWidth = 37.5 + 12.5 * ((pointsData.totalPoints - 200_000) / 300_000);
    else if (pointsData.totalPoints < 1_000_000)
      progressBarWidth = 50 + 12.5 * ((pointsData.totalPoints - 500_000) / 500_000);
    else if (pointsData.totalPoints < 2_000_000)
      progressBarWidth = 62.5 + 12.5 * ((pointsData.totalPoints - 1_000_000) / 1_000_000);
    else if (pointsData.totalPoints < 5_000_000)
      progressBarWidth = 75 + 12.5 * ((pointsData.totalPoints - 2_000_000) / 3_000_000);
    else if (pointsData.totalPoints < 100_000_000)
      progressBarWidth = 87.5 + 12.5 * ((pointsData.totalPoints - 5_000_000) / 95_000_000);
    else progressBarWidth = 100;
  }

  return (
    <>
      <div className="min-[750px]:w-[720px] w-full flex flex-col gap-8 pb-32 xl:scale-105 xl:mt-5">
        <div className="relative text-center flex flex-col gap-16 w-full overflow-hidden bg-slate-800 pt-[8.5rem] rounded-[1.8rem] border-2 border-slate-500 shadow-lg">
          <div className="absolute -top-3 right-0 left-0 bg-[url('/assets/banners/multi-airdrop-square.png')] bg-cover bg-top opacity-95 w-full h-[830px] rounded-t-[1.7rem] overflow-hidden aspect-square"></div>
          <div>
            <div className="py-3 sm:px-10 px-5 flex items-center gap-3 flex-wrap">
              <h3 className="font-bold text-[1.4rem] text-slate-100 font-heading text-start whitespace-nowrap">
                Airdropped tokens
              </h3>
              <p className="text-slate-100/60 text-sm font-medium italic">
                Hover a token to get infos
              </p>
            </div>

            <ul className="flex gap-5 flex-nowrap p-5 bg-fg/70 overflow-x-scroll scrollbar-thumb-slate-600 scrollbar-track-slate-900/70 scrollbar-w-2 scrollbar-h-2 scrollbar  scrollbar-thumb-rounded">
              <Tooltip>
                <TooltipTrigger asChild={true}>
                  <li
                    className="h-28 min-w-[127px] inline-flex flex-col items-center justify-center gap-2.5 bg-gradient-to-tl from-slate-900 to-slate-700 rounded-3xl border-2 border-slate-600 shadow-lg hover:shadow-2xl transition-shadow"
                    style={{
                      boxShadow: "3px 10px 20px 0px rgba(129,140,248,0.18)",
                      WebkitBoxShadow: "3px 10px 20px 0px rgba(129,140,248,0.18)",
                    }}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      <TokenLogo symbol="LDY" size={38} className="" />
                      <p className="text-[1.7rem] font-bold text-slate-300  font-heading leading-none">
                        LDY
                      </p>
                    </div>
                    <h4 className="text-indigo-300/60 font-heading text-[1.62rem] font-bold leading-none">
                      Ledgity
                    </h4>
                  </li>
                </TooltipTrigger>
                <TooltipContent className="font-semibold">
                  3,000,000 $LDY
                  <br />
                  -
                  <br />
                  16% of 1yr supply
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild={true}>
                  <li
                    className="h-28 min-w-[127px] inline-flex flex-col items-center justify-center gap-2.5 bg-gradient-to-tl from-slate-900 to-slate-700 rounded-3xl border-2 border-slate-600 shadow-lg hover:shadow-2xl transition-shadow"
                    style={{
                      boxShadow: "3px 10px 20px 0px rgba(223, 153, 89, 0.13)",
                      WebkitBoxShadow: "3px 10px 20px 0px rgba(223, 153, 89, 0.13)",
                    }}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      <TokenLogo symbol="LYNX" size={35} className="" />
                      <p className="text-[1rem] font-bold text-slate-300  font-heading leading-none">
                        veLYNX
                      </p>
                    </div>
                    <h4 className="text-[#df9959]/70 font-heading text-[1.62rem] font-bold leading-none">
                      Lynex
                    </h4>
                  </li>
                </TooltipTrigger>
                <TooltipContent className="font-semibold">
                  100,000 $LYNX
                  <br />
                  -
                  <br />
                  0.1% of total supply
                </TooltipContent>
              </Tooltip>

              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Revealed in
                  <br />{" "}
                  <span className="font-bold text-slate-400/80">
                    <DaysUntil date="2023-10-08" /> days
                  </span>
                </p>
              </li>
              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Revealed in
                  <br />{" "}
                  <span className="font-bold text-slate-400/80">
                    <DaysUntil date="2023-10-18" /> days
                  </span>
                </p>
              </li>
              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Revealed in
                  <br />{" "}
                  <span className="font-bold text-slate-400/80">
                    <DaysUntil date="2023-10-28" /> days
                  </span>
                </p>
              </li>
              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Not yet planned
                </p>
              </li>
              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Not yet planned
                </p>
              </li>
              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Not yet planned
                </p>
              </li>
              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Not yet planned
                </p>
              </li>
              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Not yet planned
                </p>
              </li>
              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Not yet planned
                </p>
              </li>
              <li className="h-28 min-w-[125px] inline-flex bg-gradient-to-tl from-slate-900 to-slate-800 rounded-3xl justify-center items-center p-3 border-2 border-dashed border-slate-600">
                <p className="text-center text-[0.93rem] font-semibold text-slate-500">
                  Not yet planned
                </p>
              </li>
            </ul>
          </div>

          {!isAuthenticated && (
            <div id="login">
              <div className="py-3 sm:px-10 px-5 flex items-center gap-3 flex-wrap ">
                <h3 className="font-bold text-[1.4rem] text-slate-100 font-heading text-start whitespace-nowrap">
                  Login
                </h3>
                <p className="text-slate-100/60 text-sm font-medium italic">
                  Required to participate in airdrop
                </p>
              </div>

              <ul className="flex gap-x-20 gap-y-10 justify-center flex-wrap py-10 pb-11 sm:px-10 px-5 bg-gradient-to-t from-[#293649] to-fg/70">
                <li
                  className={twMerge(
                    "flex flex-col gap-4 items-center",
                    userStatus === "authenticated" && "grayscale opacity-50 cursor-not-allowed",
                  )}
                >
                  <p className="text-slate-300 font-semibold text-[0.92rem] text-center">
                    1. Connect your Twitter account
                  </p>
                  {(userStatus === "authenticated" && (
                    <div className="flex gap-3 items-center">
                      <img
                        src={userSession.user!.image!}
                        alt=""
                        width={40}
                        height={40}
                        className="rounded-full aspect-square"
                      />
                      <p className="text-[#20456c]/80 text-lg font-semibold text-slate-100">
                        {userSession.user!.name}
                      </p>
                    </div>
                  )) || (
                    <Button
                      size="small"
                      onClick={() => signIn("twitter", { callbackUrl: "/app/airdrop" })}
                      className="bg-[#1DA1F2]/90 hover:opacity-80 transition-opacity w-min gap-1.5 items-center border-slate-300/70 text-[0.92rem] px-2.5 py-0.5 border-2 h-10"
                    >
                      <i className="ri-twitter-fill text-[1.17rem] " /> Login with Twitter
                    </Button>
                  )}
                </li>
                <li
                  className={twMerge(
                    "flex flex-col gap-4 items-center",
                    userStatus !== "authenticated" && "grayscale opacity-50 cursor-not-allowed",
                  )}
                >
                  <p className="text-slate-300 font-semibold text-[0.92rem] text-center">
                    2. Authentify your wallet
                  </p>
                  <Button
                    size="small"
                    onClick={() => handleSignature()}
                    className={twMerge(
                      "w-min gap-1.5 items-center border-slate-300/70 text-[0.92rem] px-2.5 py-0.5 border-2 h-10",
                      userStatus !== "authenticated" && "pointer-events-none",
                    )}
                  >
                    <i className="ri-wallet-3-fill text-[1.17rem]" />
                    Sign with Wallet
                  </Button>
                </li>
              </ul>
            </div>
          )}
          <div>
            <h3 className="font-bold text-[1.4rem] text-slate-100 font-heading text-start whitespace-nowrap sm:px-10 px-5 pb-5">
              Get points <i className="ri-coupon-2-fill text-slate-300 pl-1" />
            </h3>
            <div className="sm:px-8 px-5 flex gap-8 flex-wrap justify-center pb-8">
              <a
                href="https://zealy.io/c/ledgityyield/questboard"
                target="_blank"
                className="relative text-center min-w-[310px] w-[310px] min-h-40 border-2 border-[#d6409f]/[65%] bg-gradient-to-br from-[#361029]/50 to-[#d6409f]/70 rounded-[1.7rem] pt-5 flex flex-col gap-2 overflow-hidden hover:shadow-lg hover:scale-[102%] transition-all h-[180px] justify-between"
                style={{
                  boxShadow: "3px 5px 10px 0px rgba(214, 64, 159,0.2)",
                  WebkitBoxShadow: "3px 5px 10px 0px rgba(214, 64, 159,0.2)",
                }}
              >
                <div className="inline-flex items-center justify-center gap-2.5">
                  <div className="aspect-square rounded-lg bg-[#d6409f] w-[27px] h-[27px] inline-flex justify-center items-center">
                    <Image
                      src={zealyIcon}
                      width={19}
                      height={19}
                      alt="Zealy logo"
                      className="aspect-square rounded-full"
                    />
                  </div>
                  <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
                    Complete tasks
                  </h4>
                </div>

                <div className="px-4 text-slate-200/50 font-medium text-[0.92rem] leading-[1.85] text-center">
                  1 Zealy XP = 1 <i className="ri-coupon-2-fill" />
                  <br />
                  New tasks added regularly
                </div>
                <div className="flex px-4 py-2 justify-between items-center w-full min-w-full bg-[#1a071b] rounded-b-[1.6rem]">
                  <h5 className="font-semibold text-[#866d8d]">Your points</h5>
                  <div className="text-xl font-bold font-heading text-slate-200/80">
                    <i className="ri-coupon-2-fill" />{" "}
                    {pointsData ? pointsData.zealyPoints.toLocaleString() : "-"}
                  </div>
                </div>
              </a>

              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="relative text-center min-w-[310px] w-[310px] min-h-40 border-2 border-[#1DA1F2]/60 bg-gradient-to-br from-[#0e2d41]/50 to-[#1DA1F2]/75 rounded-[1.7rem] pt-5 flex flex-col gap-2 hover:shadow-lg hover:scale-[102%] transition-all h-[180px] justify-between cursor-pointer"
                    style={{
                      boxShadow: "3px 5px 10px 0px rgba(29, 161, 242,0.2)",
                      WebkitBoxShadow: "3px 5px 10px 0px rgba(29, 161, 242,0.2)",
                    }}
                  >
                    <div
                      className="bg-[#1DA1F2]/90 px-1.5 py-[0.1rem] rounded-xl absolute -top-3 -right-2 text-sm text-white font-semibold rounded-bl-sm"
                      style={{
                        boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.1)",
                        WebkitBoxShadow: "0px 0px 10px 0px rgba(255,255,255,0.1)",
                      }}
                    >
                      New
                    </div>
                    <div className="inline-flex items-center justify-center gap-2.5">
                      <div className="aspect-square rounded-lg bg-[#1DA1F2]/90 w-[27px] h-[27px] inline-flex justify-center items-center">
                        <i className="ri-twitter-fill text-white text-xl" />
                      </div>
                      <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
                        Tweet & Earn
                      </h4>
                    </div>

                    <div className="px-4 text-slate-200/50 font-medium">
                      <div className="flex flex-wrap justify-between max-w-[250px] text-[0.92rem] text-center leading-[1.85]">
                        <span className="w-1/2 inline-flex gap-2 items-center justify-center text-center">
                          <span>
                            +1 <i className="ri-coupon-2-fill" />
                          </span>{" "}
                          per <LikeIcon className="w-4 h-4 fill-[#1DA1F2]/80" />
                        </span>
                        <span className="w-1/2 inline-flex gap-2 items-center justify-center text-center">
                          <span>
                            +3 <i className="ri-coupon-2-fill" />
                          </span>{" "}
                          per <RetweetIcon className="w-4 h-4 fill-[#1DA1F2]/80" />
                        </span>
                        <span className="w-1/2 inline-flex gap-2 items-center justify-center text-center">
                          <span>
                            +5 <i className="ri-coupon-2-fill" />
                          </span>{" "}
                          per <ReplyIcon className="w-4 h-4 fill-[#1DA1F2]/80" />
                        </span>
                        <span className="w-1/2 inline-flex gap-2 items-center justify-center text-center">
                          <span>
                            +10 <i className="ri-coupon-2-fill" />
                          </span>{" "}
                          per <QuoteIcon className="w-4 h-4 fill-[#1DA1F2]/80" />
                        </span>
                      </div>
                    </div>
                    <div className="flex px-4 py-2 justify-between items-center w-full min-w-full bg-[#000f17] rounded-b-[1.6rem]">
                      <h5 className="font-semibold text-[#527682]">Your points</h5>
                      <div className="text-xl font-bold font-heading text-slate-200/80">
                        <i className="ri-coupon-2-fill" />{" "}
                        {pointsData ? pointsData.twitterPoints.toLocaleString() : "-"}
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                <AppAirdropTwitter />
              </Dialog>

              <a
                href="/app/pre-mining"
                className="relative text-center min-w-[310px] w-[310px] min-h-40 border-2 border-indigo-500/70 bg-gradient-to-br from-indigo-950/50 to-indigo-500/75 rounded-[1.7rem] pt-5 flex flex-col gap-2 overflow-hidden hover:shadow-lg hover:scale-[102%] transition-all h-[180px] justify-between"
                style={{
                  boxShadow: "3px 5px 10px 0px rgba(99, 102, 241,0.2)",
                  WebkitBoxShadow: "3px 5px 10px 0px rgba(99, 102, 241,0.2)",
                }}
              >
                <div className="inline-flex items-center justify-center gap-2.5">
                  <div className="aspect-square rounded-lg bg-primary  w-[27px] h-[27px] inline-flex justify-center items-center">
                    <i className="ri-hammer-fill text-white " />
                  </div>
                  <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
                    Invest in Pre-Mining
                  </h4>
                </div>

                <div className="px-6 text-slate-200/50 font-medium text-[0.92rem]  leading-[1.85] text-center">
                  Deposit 1 USDC for:
                  <br />
                  <ul className="flex justify-between">
                    <li>
                      3mo<span className="inline-block w-0.5"></span>=
                      <span className="inline-block w-0.5"></span>1
                      <span className="inline-block w-0.5"></span>
                      <i className="ri-coupon-2-fill" />
                    </li>
                    <li>
                      6mo<span className="inline-block w-0.5"></span>=
                      <span className="inline-block w-0.5"></span>4
                      <span className="inline-block w-0.5"></span>
                      <i className="ri-coupon-2-fill" />
                    </li>
                    <li>
                      12mo<span className="inline-block w-0.5"></span>=
                      <span className="inline-block w-0.5"></span>16
                      <span className="inline-block w-0.5"></span>
                      <i className="ri-coupon-2-fill" />
                    </li>
                  </ul>
                </div>
                <div className="flex px-4 py-2 justify-between items-center w-full min-w-full bg-[#0c0605] rounded-b-[1.6rem]">
                  <h5 className="font-semibold text-indigo-300/60">Your points</h5>
                  <div className="text-xl font-bold font-heading text-slate-200/80">
                    <i className="ri-coupon-2-fill" />{" "}
                    {pointsData ? pointsData.preMiningPoints.toLocaleString() : "-"}
                  </div>
                </div>
              </a>
              <a
                href="#"
                className="relative text-center min-w-[310px] w-[310px] min-h-40 border-2 border-[#f44c22]/60 bg-gradient-to-br from-[#391c14]/50 to-[#f44c22]/70 rounded-[1.7rem] pt-5 flex flex-col gap-2 overflow-hidden hover:shadow-lg hover:scale-[102%] transition-all h-[180px] justify-between cursor-not-allowed"
                style={{
                  boxShadow: "3px 5px 10px 0px rgba(244, 76, 34,0.2)",
                  WebkitBoxShadow: "3px 5px 10px 0px rgba(244, 76, 34,0.2)",
                }}
                aria-disabled="true"
              >
                <div className="inline-flex items-center justify-center gap-2.5">
                  <div className="aspect-square rounded-lg bg-[#f44c22]  w-[27px] h-[27px] inline-flex justify-center items-center">
                    <i className="ri-links-fill font-black text-white " />
                  </div>
                  <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
                    Referral program
                  </h4>
                </div>

                <div className="px-6 text-slate-200/50 font-medium text-[0.92rem]  leading-[1.85] text-center">
                  10 <i className="ri-coupon-2-fill" /> per USDC in Pre-Mining
                  <br />+ juicy bonuses in USDC
                </div>
                <div className="flex px-4 py-2 justify-between items-center w-full min-w-full bg-[#0c0605] rounded-b-[1.6rem]">
                  <h5 className="font-semibold text-[#8a6258]">Your points</h5>
                  <div className="text-xl font-bold font-heading text-slate-200/50">
                    Coming soon
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="relative text-center flex flex-col gap-8 w-full overflow-hidden bg-slate-800 rounded-[1.8rem] border-2 border-slate-500 shadow-lg">
          <div className="flex gap-5 sm:px-8 px-5 pt-8 items-center justify-start flex-wrap">
            <h1 className="text-slate-100 font-heading font-bold text-[1.9rem] leading-none text-center">
              Leaderboards
            </h1>
            <p className="text-center text-slate-400 font-medium text-[0.9rem] items-stretch">
              <i className="ri-information-line" /> Higher league & rank = larger airdrop
            </p>
          </div>
          <div className="w-full pt-12 overflow-x-scroll overflow-y-visible pb-4 scrollbar-thumb-slate-600 scrollbar-track-slate-900/50 scrollbar-w-2 scrollbar-h-2 scrollbar  scrollbar-thumb-rounded">
            <div className="w-full flex flex-col items-center min-w-[600px]">
              <div className="bg-slate-900 h-4 w-[calc(100%-0.5rem)] mb-2 rounded-tr-sm py-1">
                <div
                  className="bg-indigo-600/90 h-full rounded-sm relative"
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
              <ul className="flex w-full px-1 pb-[22.5px] pt-6 gap-0.5">
                <li className="w-[12.5%] relative">
                  <div className="absolute left-0">
                    <div className="absolute h-12 -mt-12 border-l-[3px] border-[#AC6400]/50 p-0 w-0 rounded-t-md"></div>
                    <p className="text-slate-400 -mt-[1.9rem] text-[0.73rem] ml-1.5 font-medium">
                      20k <i className="ri-coupon-2-fill text-slate-500" />
                    </p>
                  </div>

                  <Button
                    onClick={() => setShownLeague("bronze")}
                    disabled={leagueDataIsLoading}
                    className="bg-transparent bg-gradient-to-br from-[#AC6400]/80 to-transparent text-[0.9rem] font-bold font-heading overflow-visible w-full inline-flex flex-col p-0
                items-center justify-center border-none rounded-none pt-2 gap-1 rounded-b-3xl rounded-tr-sm h-auto [&:hover_>_img]:scale-[112%] "
                  >
                    <span className="relative">Bronze</span>
                    <Image
                      src={bronzeBadge}
                      alt="Bronze Rank's badge"
                      width={45}
                      height={45}
                      className={twMerge(
                        "-mb-[22.5px] bg-slate-800 rounded-full transition-transform",
                        shownLeague === "bronze" && "border-[#AC6400]/50 border-2",
                      )}
                    />{" "}
                  </Button>
                </li>
                <li className="w-[12.5%] relative">
                  <div className="absolute left-0">
                    <div className="absolute h-12 -mt-12 border-l-[3px] border-[#92928F]/50 p-0 w-0 rounded-t-md"></div>
                    <p className="text-slate-400 -mt-[1.9rem] text-[0.73rem] ml-1.5 font-medium">
                      50k <i className="ri-coupon-2-fill text-slate-500" />
                    </p>
                  </div>

                  <Button
                    onClick={() => setShownLeague("silver")}
                    disabled={leagueDataIsLoading}
                    className="bg-transparent bg-gradient-to-br from-[#92928F]/80 to-transparent text-[0.9rem] font-bold font-heading overflow-visible w-full inline-flex flex-col p-0
                items-center justify-center border-none rounded-none pt-2 gap-1 rounded-b-3xl rounded-tr-sm h-auto [&:hover_>_img]:scale-[112%]"
                  >
                    <span className="relative">Silver</span>
                    <Image
                      src={silverBadge}
                      alt="Silver Rank's badge"
                      width={45}
                      height={45}
                      className={twMerge(
                        "-mb-[22.5px] bg-slate-800 rounded-full transition-transform",
                        shownLeague === "silver" && "border-[#92928F]/50 border-2",
                      )}
                    />{" "}
                  </Button>
                </li>
                <li className="w-[12.5%] relative">
                  <div className="absolute left-0">
                    <div className="absolute h-12 -mt-12 border-l-[3px] border-[#DA9E01]/40 p-0 w-0 rounded-t-md"></div>
                    <p className="text-slate-400 -mt-[1.9rem] text-[0.73rem] ml-1.5 font-medium">
                      100k <i className="ri-coupon-2-fill text-slate-500" />
                    </p>
                  </div>
                  <Button
                    onClick={() => setShownLeague("gold")}
                    disabled={leagueDataIsLoading}
                    className="bg-transparent bg-gradient-to-br from-[#DA9E01]/70 to-transparent text-[0.9rem] font-bold font-heading overflow-visible w-full inline-flex flex-col p-0
                items-center justify-center border-none rounded-none pt-2 gap-1 rounded-b-3xl rounded-tr-sm h-auto [&:hover_>_img]:scale-[112%]"
                  >
                    <span className="relative">Gold</span>
                    <Image
                      src={goldBadge}
                      alt="Gold Rank's badge"
                      width={45}
                      height={45}
                      className={twMerge(
                        "-mb-[22.5px] bg-slate-800 rounded-full transition-transform",
                        shownLeague === "gold" && "border-[#DA9E01]/40 border-2",
                      )}
                    />{" "}
                  </Button>
                </li>
                <li className="w-[12.5%] relative">
                  <div className="absolute left-0">
                    <div className="absolute h-12 -mt-12 border-l-[3px] border-[#005eff]/50 p-0 w-0 rounded-t-md"></div>
                    <p className="text-slate-400 -mt-[1.9rem] text-[0.73rem] ml-1.5 font-medium">
                      200k <i className="ri-coupon-2-fill text-slate-500" />
                    </p>
                  </div>
                  <Button
                    onClick={() => setShownLeague("elite")}
                    disabled={leagueDataIsLoading}
                    className="bg-transparent bg-gradient-to-br from-[#005eff]/80 to-transparent text-[0.9rem] font-bold font-heading overflow-visible w-full inline-flex flex-col p-0
                items-center justify-center border-none rounded-none pt-2 gap-1 rounded-b-3xl rounded-tr-sm h-auto [&:hover_>_img]:scale-[112%]"
                  >
                    <span className="relative">Elite</span>
                    <Image
                      src={eliteBadge}
                      alt="Elite Rank's badge"
                      width={45}
                      height={45}
                      className={twMerge(
                        "-mb-[22.5px] bg-slate-800 rounded-full transition-transform",
                        shownLeague === "elite" && "border-[#005eff]/50 border-2",
                      )}
                    />{" "}
                  </Button>
                </li>
                <li className="w-[12.5%] relative">
                  <div className="absolute left-0">
                    <div className="absolute h-12 -mt-12 border-l-[3px] border-[#A145F5]/50 p-0 w-0 rounded-t-md"></div>
                    <p className="text-slate-400 -mt-[1.9rem] text-[0.73rem] ml-1.5 font-medium">
                      500k <i className="ri-coupon-2-fill text-slate-500" />
                    </p>
                  </div>
                  <Button
                    onClick={() => setShownLeague("ruby")}
                    disabled={leagueDataIsLoading}
                    className="bg-transparent bg-gradient-to-br from-[#A145F5]/80 to-transparent text-[0.9rem] font-bold font-heading overflow-visible w-full inline-flex flex-col p-0
                items-center justify-center border-none rounded-none pt-2 gap-1 rounded-b-3xl rounded-tr-sm h-auto [&:hover_>_img]:scale-[112%]"
                  >
                    <span className="relative">Ruby</span>
                    <Image
                      src={rubyBadge}
                      alt="Ruby Rank's badge"
                      width={45}
                      height={45}
                      className={twMerge(
                        "-mb-[22.5px] bg-slate-800 rounded-full transition-transform",
                        shownLeague === "ruby" && "border-[#A145F5]/50 border-2",
                      )}
                    />{" "}
                  </Button>
                </li>
                <li className="w-[12.5%] relative">
                  <div className="absolute left-0">
                    <div className="absolute h-12 -mt-12 border-l-[3px] border-[#b72b00]/50 p-0 w-0 rounded-t-md"></div>
                    <p className="text-slate-400 -mt-[1.9rem] text-[0.73rem] ml-1.5 font-medium">
                      1M <i className="ri-coupon-2-fill text-slate-500" />
                    </p>
                  </div>
                  <Button
                    onClick={() => setShownLeague("titan")}
                    disabled={leagueDataIsLoading}
                    className="bg-transparent bg-gradient-to-br from-[#b72b00]/80 to-[#b72b00]/10 text-[0.9rem] font-bold font-heading overflow-visible w-full inline-flex flex-col p-0
                items-center justify-center border-none rounded-none pt-2 gap-1 rounded-b-3xl rounded-tr-sm h-auto [&:hover_>_img]:scale-[112%]"
                  >
                    <span className="relative">Titan</span>
                    <Image
                      src={titanBadge}
                      alt="Titan Rank's badge"
                      width={45}
                      height={45}
                      className={twMerge(
                        "-mb-[22.5px] bg-slate-800 rounded-full transition-transform",
                        shownLeague === "titan" && "border-[#b72b00]/50 border-2",
                      )}
                    />{" "}
                  </Button>
                </li>
                <li className="w-[12.5%] relative">
                  <div className="absolute left-0">
                    <div className="absolute h-12 -mt-12 border-l-[3px] border-[#fff]/30 p-0 w-0 rounded-t-md"></div>
                    <p className="text-slate-400 -mt-[1.9rem] text-[0.73rem] ml-1.5 font-medium">
                      2M <i className="ri-coupon-2-fill text-slate-500" />
                    </p>
                  </div>
                  <Button
                    onClick={() => setShownLeague("legend")}
                    disabled={leagueDataIsLoading}
                    className="bg-transparent bg-gradient-to-br from-[#fff]/80 to-[#fff]/20 text-[0.88rem] font-bold font-heading overflow-visible w-full inline-flex flex-col p-0
                items-center justify-center border-none rounded-none pt-2 gap-1 rounded-b-3xl rounded-tr-sm h-auto [&:hover_>_img]:scale-[112%] text-slate-900"
                  >
                    <span className="relative text-center font-black">Legend</span>
                    <Image
                      src={legendBadge}
                      alt="Legend Rank's badge"
                      width={45}
                      height={45}
                      className={twMerge(
                        "-mb-[22.5px] bg-slate-800 rounded-full transition-transform",
                        shownLeague === "legend" && "border-[#fff]/30 border-2",
                      )}
                    />
                  </Button>
                </li>
                <li className="w-[12.5%]">
                  <div className="absolute left-0">
                    <div className="absolute h-12 -mt-12 border-l-[3px] border-[#000]/80 p-0 w-0 rounded-t-md"></div>
                    <p className="text-slate-400 -mt-[1.9rem] text-[0.73rem] ml-1.5 font-medium">
                      5M <i className="ri-coupon-2-fill text-slate-500" />
                    </p>
                  </div>
                  <Button
                    onClick={() => setShownLeague("secret")}
                    disabled={leagueDataIsLoading}
                    className="bg-transparent bg-gradient-to-br from-[#000] to-[#000]/30 text-[0.9rem] font-bold font-heading overflow-visible w-full inline-flex flex-col p-0
                items-center justify-center border-none rounded-none pt-2 gap-1 rounded-b-3xl rounded-tr-sm h-auto [&:hover_>_img]:scale-[112%] relative"
                  >
                    <span className="relative text-center font-black text-slate-500">?????</span>
                    <Image
                      src={secretBadge}
                      alt="Secret Rank's badge"
                      width={45}
                      height={45}
                      className={twMerge(
                        "-mb-[22.5px] bg-slate-800 rounded-full transition-transform",
                        shownLeague === "secret" && "border-[#000]/80 border-2",
                      )}
                    />
                  </Button>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3 justify-center items-center -mt-4 px-4">
            <i className="ri-corner-left-up-line text-slate-500 font-bold" />
            <p className="text-slate-400 font-medium">Click on a league to see its leaderboard</p>
            <i className="ri-corner-right-up-line text-slate-500 font-bold" />
          </div>
          <div className="relative grid grid-cols-[minmax(60px,80px),minmax(130px,auto),minmax(100px,auto)] text-slate-400 w-full max-h-[450px] overflow-y-scroll scrollbar-thumb-slate-600 scrollbar-track-slate-900/50 scrollbar-w-2 scrollbar-h-2 scrollbar scrollbar-thumb-rounded scale-100 px-1">
            <p className="py-2.5 bg-slate-400 text-slate-700 sticky top-0 z-10 font-bold text-sm border-y border-y-slate-900 rounded-tl-lg rounded-bl-md text-start pl-4 mb-0.5 -mx-1">
              #
            </p>
            <p className="py-2.5 bg-slate-400 text-slate-700 sticky top-0 z-10 font-bold text-sm border-y border-y-slate-900 text-start pl-1 mb-0.5">
              User
            </p>
            <p className="py-2.5 bg-slate-400 text-slate-700 sticky top-0 z-10 font-bold text-sm border-y border-y-slate-900 rounded-tr-lg rounded-br-md text-end pr-4 mb-0.5 -mx-1">
              Points <i className="ri-coupon-2-fill text-slate-600" />
            </p>
            {(() => {
              if (leagueDataIsLoading)
                return (
                  <p className="col-span-3 text-center font-medium my-3 inline-flex justify-center items-center leading-none">
                    <Spinner className="text-slate-300 leading-none aspect-square" />
                  </p>
                );
              else if (!leagueData || !leagueData.data)
                return (
                  <p className="col-span-3 text-slate-300 text-center font-medium py-3">
                    No one here yet.
                  </p>
                );
              else
                return leagueData.data.map((user, index) => (
                  <>
                    <p
                      className={twMerge(
                        "sm:text-xl text-lg font-heading text-slate-500 py-2 leading-none inline-flex items-center pl-4 my-0.5 rounded-l-xl bg-slate-950/70",
                        index % 2 === 0 && "bg-slate-900/70",
                      )}
                    >
                      {index + 1}.
                    </p>
                    <Link
                      href={`https://twitter.com/${user.twitterUsername}`}
                      target="_blank"
                      className={twMerge(
                        "flex sm:gap-3 gap-2 py-2 items-center my-0.5 bg-slate-950/70",
                        index % 2 === 0 && "bg-slate-900/70",
                      )}
                    >
                      <img
                        src={`/api/airdrop/twitterImage?url=${user.image}`}
                        width={35}
                        height={35}
                        alt=""
                        className="rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-500 overflow-hidden sm:min-w-[35px] sm:max-w-sm:[35px] sm:min-h-[35px] sm:max-h-[35px] min-w-[30px] max-w-[30px] min-h-[30px] max-h-[30px] aspect-square"
                      />
                      <p className="font-medium sm:text-base text-sm leading-none text-ellipsis max-w-full inline-block truncate">
                        @{user.twitterUsername}
                      </p>
                    </Link>
                    <p
                      className={twMerge(
                        "py-2 pr-4 inline-flex items-center justify-end sm:text-base text-sm font-medium my-0.5 rounded-r-xl bg-slate-950/70",
                        index % 2 === 0 && "bg-slate-900/70",
                      )}
                    >
                      {user.totalPoints.toLocaleString()}
                    </p>
                  </>
                ));
            })()}
            {pointsData && shownLeague == pointsData.league && (
              <>
                <p className="sm:text-xl text-lg font-heading py-2 leading-none inline-flex items-center pl-4 rounded-l-xl bg-indigo-600 text-slate-300 sticky bottom-0">
                  {pointsData.rank}.
                </p>
                <Link
                  href={`https://twitter.com/${pointsData.twitterUsername}`}
                  target="_blank"
                  className="flex sm:gap-3 gap-2 py-2 items-center bg-indigo-600 text-slate-300 sticky bottom-0"
                >
                  <img
                    src={`/api/airdrop/twitterImage?url=${pointsData.image}`}
                    width={35}
                    height={35}
                    alt=""
                    className="rounded-xl bg-gradient-to-br from-indigo-700 to-indigo-500 overflow-hidden sm:min-w-[35px] sm:max-w-sm:[35px] sm:min-h-[35px] sm:max-h-[35px] min-w-[30px] max-w-[30px] min-h-[30px] max-h-[30px] aspect-square "
                  />
                  <p className="font-medium sm:text-base text-sm leading-none text-ellipsis max-w-full inline-block truncate">
                    @{pointsData.twitterUsername}
                  </p>
                </Link>
                <p className="py-2 pr-4 inline-flex items-center justify-end sm:text-base text-sm font-bold rounded-r-xl bg-indigo-600 text-slate-300 sticky bottom-0">
                  {pointsData.totalPoints.toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>
        <p className="text-sm text-[#20456c]/70 pl-1 font-medium mx-5 -mt-3">
          Data are refreshed every <span className="font-bold">5 minutes</span>.
        </p>
      </div>
      {createPortal(
        <div className="fixed bottom-5 left-0 right-0 inline-flex justify-center items-center z-10 sm:scale-100 scale-95">
          <Link href="#login" className={clsx(isAuthenticated && "cursor-text")}>
            <div
              className={twMerge(
                "border-2 backdrop-blur-md rounded-3xl inline-flex items-center",
                isAuthenticated &&
                  pointsData &&
                  walletMissingPoints > 0 &&
                  "bg-[#340606]/60 border-red-400/70",
                isAuthenticated &&
                  pointsData &&
                  walletMissingPoints <= 0 &&
                  "bg-[#06340d]/60 border-emerald-400/70",
                (!isAuthenticated || !pointsData) && "bg-slate-900/60 border-slate-500/70",
              )}
              style={{
                boxShadow: "0px 0px 10px 5px rgba(255,255,255,0.2)",
                WebkitBoxShadow: "0px 0px 10px 5px rgba(255,255,255,0.2)",
              }}
            >
              <div className="px-4 py-2 text-2xl font-bold font-heading text-white text-center inline-flex justify-center items-center">
                {(() => {
                  if (!isAuthenticated || !pointsData)
                    return <i className="ri-lock-fill text-xl" />;
                  else
                    return (
                      <p className="whitespace-nowrap">
                        {pointsData ? pointsData.totalPoints.toLocaleString() : "-"}{" "}
                        <i className="ri-coupon-2-fill" />
                      </p>
                    );
                })()}
              </div>
              <div
                className={twMerge(
                  "px-4 py-1  text-white rounded-r-[1.35rem] inline-flex flex-col gap-0 items-center justify-center border-l-2",
                  isAuthenticated &&
                    pointsData &&
                    walletMissingPoints > 0 &&
                    "border-red-400/70 bg-red-700/70",
                  isAuthenticated &&
                    pointsData &&
                    walletMissingPoints <= 0 &&
                    "border-emerald-400/70 bg-emerald-700/70",
                  (!isAuthenticated || !pointsData) && "bg-slate-700/70 border-slate-500/70",
                )}
              >
                {(() => {
                  if (isAuthenticated && pointsData && walletMissingPoints > 0)
                    return (
                      <>
                        <p className="text-center font-bold text-white/80">Not eligible</p>
                        <p className="text-center text-sm">
                          {walletMissingPoints.toLocaleString()} <i className="ri-coupon-2-fill" />{" "}
                          missing
                        </p>
                      </>
                    );
                  else if (isAuthenticated && pointsData && walletMissingPoints <= 0)
                    return (
                      <>
                        <p className="text-center font-bold text-white/80">Eligible</p>
                        <p className="text-center text-sm">League: {pointsData?.league}</p>
                      </>
                    );
                  else if (!isAuthenticated || !pointsData)
                    return (
                      <>
                        <p className="text-center font-bold text-white/80 text-[0.91rem]">
                          Login to check your
                          <br />
                          airdrop eligibility
                        </p>
                      </>
                    );
                })()}
              </div>
            </div>
          </Link>
        </div>,
        document.body,
      )}
    </>
  );
};
