import {
  Button,
  DaysUntil,
  Dialog,
  DialogTrigger,
  TokenLogo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useWalletClient } from "wagmi";
import galxeIcon from "~/assets/partners/galxe-icon.png";
import zealyIcon from "~/assets/partners/zealy-icon.svg";
import { usePreMiningAccountsLocks } from "@/generated";
import { formatUnits, zeroAddress } from "viem";
import { useSession, signIn, signOut } from "next-auth/react";
import { twMerge } from "tailwind-merge";
import { AppAirdropTwitter } from "./AppAirdropTwitter";
import { LikeIcon, QuoteIcon, ReplyIcon, RetweetIcon } from "@/lib/icons";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { useToast } from "@/hooks/useToast";

export const AppAirdrop: FC = () => {
  const { data: walletClient } = useWalletClient();
  const { data: userSession, status: userStatus, update: updateSession } = useSession();
  const [walletZealyEntries, setWalletZealyEntries] = useState<number>(0);
  const [walletGalxeEntries, setWalletGalxeEntries] = useState<number>(0);
  const { toast } = useToast();

  // Compute wallet's pre-mining entries
  let walletPreMiningEntries = 0;
  const { data: walletLockInfos } = usePreMiningAccountsLocks({
    args: [
      userSession && userSession.user.walletAddress
        ? (userSession.user.walletAddress as `0x${string}`)
        : zeroAddress,
    ],
    watch: true,
  });
  if (walletLockInfos) {
    const amount = Number(formatUnits(walletLockInfos[0], 6));
    const duration = walletLockInfos[1];
    if (duration <= 3) walletPreMiningEntries = amount;
    else if (duration <= 6) walletPreMiningEntries = amount * 4;
    else if (duration <= 12) walletPreMiningEntries = amount * 16;
  }

  // Retrieves quests leaderboards data
  const retrieveZealyEntries = async () => {
    const res = await fetch("/api/airdrop/entries/user/zealy");

    if (!res.ok) {
      setWalletZealyEntries(0);
      throw new Error("Failed to fetch Zealy entries.");
    }

    const data = await res.json();

    setWalletZealyEntries(data.entries);
  };

  const retrieveGalxeEntries = async () => {
    const res = await fetch("/api/airdrop/entries/user/galxe");

    if (!res.ok) {
      setWalletGalxeEntries(0);
      throw new Error("Failed to fetch Galxe entries.");
    }

    const data = await res.json();

    setWalletGalxeEntries(data.entries);
  };

  useEffect(() => {
    if (userSession && userSession.user.walletAddress) {
      retrieveZealyEntries();
      retrieveGalxeEntries();
    }
  }, [userSession]);

  // Compute wallet total entries
  let walletTotalEntries = walletGalxeEntries + walletZealyEntries + walletPreMiningEntries;

  // Compute wallet missing entries
  const walletMissingEntries = 20000 - walletTotalEntries;

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

  return (
    <>
      <div className="min-[750px]:w-[720px] w-full flex flex-col gap-8 pb-32 xl:scale-105 xl:mt-5">
        <div className="relative flex flex-col gap-16 w-full overflow-hidden bg-slate-800 pt-[8.5rem] rounded-[1.8rem] border-2 border-slate-500 shadow-lg">
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

            <ul className="flex gap-5 flex-nowrap p-5 bg-fg/70 overflow-x-scroll scrollbar-thumb-slate-600 scrollbar-track-slate-950/70 scrollbar-thin  scrollbar-thumb-rounded">
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
                      <Image
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
              Get entries <i className="ri-coupon-2-fill text-slate-300 pl-1" />
            </h3>
            <div className="sm:px-8 px-5 flex gap-8 flex-wrap justify-center pb-8">
              <a
                href="https://zealy.io/c/ledgityyield/questboard"
                target="_blank"
                className="relative min-w-[310px] w-[310px] min-h-40 border-2 border-[#6b5770] bg-gradient-to-br from-[#4b3a4b]/80 to-[#d6409f]/40 backdrop-blur-md rounded-[1.7rem] pt-5 flex flex-col gap-2 overflow-hidden hover:shadow-lg hover:scale-[102%] transition-all h-[180px] justify-between"
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
                    Complete tasks on Zealy
                  </h4>
                </div>

                <div className="px-4 text-slate-200/50 font-medium text-[0.92rem] leading-[1.85] text-center">
                  1 Zealy XP = 1 <i className="ri-coupon-2-fill" />
                  <br />
                  New tasks added regularly
                </div>
                <div className="flex px-4 py-2 justify-between items-center w-full min-w-full bg-[#1a071b] rounded-b-[1.7rem]">
                  <h5 className="font-semibold text-[#866d8d]">Your entries</h5>
                  <div className="text-xl font-bold font-heading text-slate-200/80">
                    <i className="ri-coupon-2-fill" /> {walletZealyEntries.toLocaleString()}
                  </div>
                </div>
              </a>

              <Dialog>
                <DialogTrigger asChild>
                  <div
                    className="relative min-w-[310px] w-[310px] min-h-40 border-2 border-[#436874] bg-gradient-to-br from-[#264456]/80 to-[#1DA1F2]/40 backdrop-blur-md rounded-[1.7rem] pt-5 flex flex-col gap-2 hover:shadow-lg hover:scale-[102%] transition-all h-[180px] justify-between cursor-pointer"
                    style={{
                      boxShadow: "3px 5px 10px 0px rgba(29, 161, 242,0.2)",
                      WebkitBoxShadow: "3px 5px 10px 0px rgba(29, 161, 242,0.2)",
                    }}
                  >
                    {/* <div
                      className="bg-[#1DA1F2]/90 px-1.5 py-[0.1rem] rounded-xl absolute -top-3 -right-2 text-sm text-white font-semibold rounded-bl-sm"
                      style={{
                        boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.1)",
                        WebkitBoxShadow: "0px 0px 10px 0px rgba(255,255,255,0.1)",
                      }}
                    >
                      New
                    </div> */}
                    <div className="inline-flex items-center justify-center gap-2.5">
                      <div className="aspect-square rounded-lg bg-[#1DA1F2]/90 w-[27px] h-[27px] inline-flex justify-center items-center">
                        <i className="ri-twitter-fill text-white text-xl" />
                      </div>
                      <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
                        Post about Multi-Airdrop
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
                    <div className="flex px-4 py-2 justify-between items-center w-full min-w-full bg-[#000f17] rounded-b-[1.7rem]">
                      <h5 className="font-semibold text-[#527682]">Your entries</h5>
                      <div className="text-xl font-bold font-heading text-slate-200/80">
                        <i className="ri-coupon-2-fill" /> {(0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </DialogTrigger>
                {/* <AppAirdropTwitter /> */}
              </Dialog>

              <a
                href="/app/pre-mining"
                className="relative min-w-[310px] w-[310px] min-h-40 border-2 border-[#7a5147] bg-gradient-to-br from-[#443b38]/80 to-[#f44c22]/40 backdrop-blur-md rounded-[1.7rem] pt-5 flex flex-col gap-2 overflow-hidden hover:shadow-lg hover:scale-[102%] transition-all h-[180px] justify-between"
                style={{
                  boxShadow: "3px 5px 10px 0px rgba(244, 76, 34,0.2)",
                  WebkitBoxShadow: "3px 5px 10px 0px rgba(244, 76, 34,0.2)",
                }}
              >
                <div className="inline-flex items-center justify-center gap-2.5">
                  <div className="aspect-square rounded-lg bg-[#f44c22]  w-[27px] h-[27px] inline-flex justify-center items-center">
                    <i className="ri-hammer-fill text-bg " />
                  </div>
                  <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
                    Participate in Pre-Mining
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
                <div className="flex px-4 py-2 justify-between items-center w-full min-w-full bg-[#0c0605] rounded-b-[1.7rem]">
                  <h5 className="font-semibold text-[#8a6258]">Your entries</h5>
                  <div className="text-xl font-bold font-heading text-slate-200/80">
                    <i className="ri-coupon-2-fill" /> {walletPreMiningEntries.toLocaleString()}
                  </div>
                </div>
              </a>

              <a
                href="https://galxe.com/ledgityyield/campaign/GCi9RU3En8"
                target="_blank"
                className="relative min-w-[310px] w-[310px] min-h-40 border-2 border-[#5b5b5b] bg-gradient-to-br from-[#222222]/60 to-[#555555]/90  backdrop-blur-md rounded-[1.7rem] pt-5 flex flex-col gap-2 hover:shadow-lg hover:scale-[102%] transition-all h-[180px] justify-between"
                style={{
                  boxShadow: "3px 5px 10px 0px rgba(255,255,255,0.1)",
                  WebkitBoxShadow: "3px 5px 10px 0px rgba(255,255,255,0.1)",
                }}
              >
                <div className="inline-flex items-center justify-center gap-2.5">
                  <Image
                    src={galxeIcon}
                    width={25}
                    height={25}
                    alt="Galxe logo"
                    className="aspect-square rounded-lg w-[27px] h-[27px] bg-black"
                    style={{
                      boxShadow: "0px 0px 10px 0px rgba(255,255,255,0.1)",
                      WebkitBoxShadow: "0px 0px 10px 0px rgba(255,255,255,0.1)",
                    }}
                  />
                  <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">
                    Complete tasks on Galxe
                  </h4>
                </div>

                <div className="px-4 text-slate-200/50 font-medium text-[0.92rem] leading-[1.85] text-center">
                  1 Galxe point = 1 <i className="ri-coupon-2-fill" />
                  <br />
                  New tasks added regularly
                </div>
                <div className="flex px-4 py-2 justify-between items-center w-full min-w-full bg-gray-950 rounded-b-[1.7rem]">
                  <h5 className="font-semibold text-slate-200/50 inline-flex items-center">
                    Your entries
                  </h5>
                  <div className="text-xl font-bold font-heading text-slate-200/80">
                    <i className="ri-coupon-2-fill" /> {walletGalxeEntries.toLocaleString()}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <p className="text-sm text-[#20456c]/70 pl-1 font-medium mx-5 -mt-3">
          Data may take up to <span className="font-bold">24h</span> to be reflected here.
        </p>
      </div>
      {createPortal(
        <div className="fixed bottom-5 left-0 right-0 inline-flex justify-center items-center z-10">
          <Link href="#login" className={clsx(isAuthenticated && "cursor-text")}>
            <div
              className={twMerge(
                "border-2 backdrop-blur-md rounded-3xl inline-flex items-center",
                isAuthenticated && walletMissingEntries > 0 && "bg-[#340606]/60 border-red-400/70",
                isAuthenticated &&
                  walletMissingEntries <= 0 &&
                  "bg-[#06340d]/60 border-emerald-400/70",
                !isAuthenticated && "bg-slate-900/60 border-slate-500/70",
              )}
              style={{
                boxShadow: "0px 0px 10px 5px rgba(255,255,255,0.2)",
                WebkitBoxShadow: "0px 0px 10px 5px rgba(255,255,255,0.2)",
              }}
            >
              <div className="px-4 py-2 text-2xl font-bold font-heading text-white text-center inline-flex justify-center items-center">
                {(() => {
                  if (!isAuthenticated) return <i className="ri-lock-fill text-xl" />;
                  else
                    return (
                      <p>
                        {walletTotalEntries.toLocaleString()} <i className="ri-coupon-2-fill" />
                      </p>
                    );
                })()}
              </div>
              <div
                className={twMerge(
                  "px-4 py-1  text-white rounded-r-[1.35rem] inline-flex flex-col gap-0 items-center justify-center border-l-2",
                  isAuthenticated && walletMissingEntries > 0 && "border-red-400/70 bg-red-500/70",
                  isAuthenticated &&
                    walletMissingEntries <= 0 &&
                    "border-emerald-400/70 bg-emerald-700/70",
                  !isAuthenticated && "bg-slate-700/70 border-slate-500/70",
                )}
              >
                {(() => {
                  if (isAuthenticated && walletMissingEntries > 0)
                    return (
                      <>
                        <p className="text-center font-bold text-white/80">Not eligible</p>
                        <p className="text-center text-sm">
                          {walletMissingEntries.toLocaleString()} <i className="ri-coupon-2-fill" />{" "}
                          missing
                        </p>
                      </>
                    );
                  else if (isAuthenticated && walletMissingEntries <= 0)
                    return (
                      <>
                        <p className="text-center font-bold text-white/80">Eligible</p>
                        <p className="text-center text-sm">League: Bronze</p>
                      </>
                    );
                  else if (!isAuthenticated)
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
