import {
  Card,
  DaysUntil,
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

export const AppAirdrop: FC = () => {
  const { data: walletClient } = useWalletClient();
  const [leaderboards, setLeaderboards] = useState<any>();

  // Will store the total number of entries for the wallet
  let walletTotalEntries = 0;

  // Compute wallet's pre-mining entries
  let walletPreMiningEntries = 0;
  const { data: walletLockInfos } = usePreMiningAccountsLocks({
    args: [walletClient?.account.address ? walletClient.account.address : zeroAddress],
    watch: true,
  });
  if (walletLockInfos) {
    const amount = Number(formatUnits(walletLockInfos[0], 6));
    const duration = walletLockInfos[1];
    if (duration <= 3) walletPreMiningEntries = amount;
    else if (duration <= 6) walletPreMiningEntries = amount * 2;
    else if (duration <= 12) walletPreMiningEntries = amount * 5;
    walletTotalEntries += walletPreMiningEntries;
  }

  // Retrieves quests leaderboards data
  const computeLeaderboards = async () => {
    const responses = await Promise.all([
      fetch("/api/airdrop/galxe/leaderboard"),
      fetch("/api/airdrop/zealy/leaderboard"),
    ]);

    if (!responses.every((res) => res.ok)) {
      console.log(responses);
      throw new Error("Failed to fetch data");
    }

    const data = await Promise.all(responses.map((res) => res.json()));

    setLeaderboards({
      galxe: data[0].data,
      zealy: data[1].data,
    });
  };

  useEffect(() => {
    if (walletClient) computeLeaderboards();
  }, [walletClient]);

  // Compute wallet entries amounts
  let walletGalxeEntries = 0;
  let walletZealyEntries = 0;
  if (walletClient && leaderboards) {
    if (leaderboards.galxe[walletClient.account.address.toLowerCase()]) {
      walletGalxeEntries = leaderboards.galxe[walletClient.account.address.toLowerCase()];
      walletTotalEntries += walletGalxeEntries;
    }
    if (leaderboards.zealy[walletClient.account.address]) {
      walletZealyEntries = leaderboards.zealy[walletClient.account.address];
      walletTotalEntries += walletZealyEntries;
    }
  }

  // Compute wallet missing entries
  const walletMissingEntries = 20000 - walletTotalEntries;

  return (
    <div className="lg:w-[830px] w-full flex flex-col gap-8 pb-8">
      <Card
        defaultGradient={false}
        circleIntensity={0}
        animated={false}
        className="flex flex-col gap-10 w-full overflow-hidden bg-gradient-to-br from-[#28a0f0]/20 to-[#28a0f0]/60 sm:pb-10 pb-5"
      >
        <h2 className="relative text-bg font-bold font-heading text-4xl text-center before:absolute before:inset-0 md:leading-none leading-relaxed sm:p-10 p-5 before:bg-gradient-to-r before:from-[#20456c]/[90%] before:via-[#20456c] before:to-[#20456c]/[90%] bg-[url('/assets/textures/flying-tokens.png')] bg-contain rounded-3xl overflow-hidden">
          <span>
            Ledgity <span className="whitespace-nowrap">Multi-Airdrop</span>
          </span>
        </h2>
        <div className="flex gap-10  sm:px-10 px-5 flex-wrap">
          <div className="md:w-[calc((100%-2.5rem)/2)] flex flex-col gap-2.5 min-w-[300px]">
            <h3 className="font-bold text-2xl text-[#20456c] font-heading">What?</h3>
            <div className="text-[#20456c]/80 font-medium text-lg">
              To reward its earliest community members,{" "}
              <span className="font-bold text-[#20456c]">Ledgity Yield will airdrop</span>:
              <ul className="list-disc pl-5">
                <li>16% of its 1-year supply</li>
                <li>tokens from its partners</li>
              </ul>
            </div>
          </div>
          <div className="md:w-[calc((100%-2.5rem)/2)] w-full flex flex-col gap-2.5 min-w-[300px]">
            <h3 className="font-bold text-2xl text-[#20456c] font-heading">Calculation</h3>
            <ul className="list-disc pl-5 text-[#20456c]/80 font-medium text-lg">
              <li>
                Received airdrop size is{" "}
                <span className="font-bold text-[#20456c]">proportional</span> to your{" "}
                <span className="font-bold text-[#20456c]">
                  number of &ldquo;entries <i className="ri-coupon-2-fill" />
                </span>
                &rdquo;
              </li>
              <li>
                At least{" "}
                <span className="font-bold text-[#20456c]">
                  20,000 <i className="ri-coupon-2-fill" />
                </span>{" "}
                are required
              </li>
            </ul>
            <Link
              href="https://docs.ledgity.finance/opportunities/airdrop"
              target="_blank"
              className="text-lg font-semibold text-[#20456c]/90 underline decoration-[#20456c]/20 underline-offset-2 transition-colors hover:text-[#20456c] "
            >
              Learn more <i className="ri-arrow-right-line" />
            </Link>
          </div>
        </div>
        <div>
          <div className="py-3 sm:px-10 px-5 flex items-center gap-3 flex-wrap">
            <h3 className="font-bold text-2xl text-[#20456c] font-heading text-start whitespace-nowrap">
              Airdropped tokens
            </h3>
            <p className="text-[#20456c]/70">Hover a token to get infos</p>
          </div>

          <ul className="flex gap-5 flex-nowrap overflow-x-scroll bg-[#20456c]/5 p-5">
            <Tooltip>
              <TooltipTrigger
                asChild={true}
                className="h-32 min-w-[140px] inline-flex flex-col items-center justify-center bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl p-3 gap-3 shadow-lg border-2 border-[#20456c]/50 hover:shadow-2xl transition-shadow"
              >
                <li>
                  <div className="inline-flex items-center gap-2">
                    <TokenLogo symbol="LDY" size={45} className="" />
                    <p className="text-3xl font-bold text-fg/80  font-heading">LDY</p>
                  </div>
                  <h4 className="text-[#20456c]/30 font-heading text-3xl font-bold">Ledgity</h4>
                </li>
              </TooltipTrigger>
              <TooltipContent className="font-semibold">3,000,000 $LDY</TooltipContent>
            </Tooltip>

            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">
                Revealed in
                <br />{" "}
                <span className="font-bold">
                  <DaysUntil date="2023-09-27" /> days
                </span>
              </p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">
                Revealed in
                <br />{" "}
                <span className="font-bold">
                  <DaysUntil date="2023-10-04" /> days
                </span>
              </p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">
                Revealed in
                <br />{" "}
                <span className="font-bold">
                  <DaysUntil date="2023-10-11" /> days
                </span>
              </p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">
                Revealed in
                <br />{" "}
                <span className="font-bold">
                  <DaysUntil date="2023-10-18" /> days
                </span>
              </p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">Not yet planned</p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">Not yet planned</p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">Not yet planned</p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">Not yet planned</p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">Not yet planned</p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">Not yet planned</p>
            </li>
            <li className="h-32 min-w-[138px] inline-flex bg-gradient-to-tr from-[#20456c]/[2%] to-[#20456c]/[15%] drop-shadow-sm rounded-3xl justify-center items-center p-3 border-2 border-dashed border-[#20456c]/50">
              <p className="text-center font-semibold text-[#20456c]/50">Not yet planned</p>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-2xl text-[#20456c] font-heading text-start py-3 pb-5 sm:px-10 px-5">
            Get entries <i className="ri-coupon-2-fill" />
          </h3>
          <div className="sm:px-10 px-5 flex gap-10 flex-wrap justify-center">
            <a
              href="https://zealy.io/c/ledgityyield/questboard"
              target="_blank"
              className="relative sm:min-w-[350px] min-w-[315px] flex-grow min-h-40 border-2 border-[#20456c]/20 rounded-2xl pt-5 flex flex-col gap-2 overflow-hidden shadow-md hover:shadow-lg hover:scale-[102%] transition-all h-[200px] justify-between"
            >
              <div className="absolute top-0 right-0 bg-[#d6409f] rounded-bl-xl w-[30px] h-[30px] inline-flex justify-center items-center">
                <Image
                  src={zealyIcon}
                  width={20}
                  height={20}
                  alt="Zealy logo"
                  className="aspect-square"
                />
              </div>

              <h4 className="text-xl font-heading font-bold px-5">Complete tasks on Zealy</h4>

              <div className="px-8 text-[#20456c]/90 font-medium">
                New tasks on Mondays & Thursdays
                <br />
                1 Zealy XP = 1 <i className="ri-coupon-2-fill" />
              </div>
              <div className="flex p-3 justify-between items-center w-full bg-[#20456c]/10">
                <h5 className="font-semibold text-lg text-[#20456c]/50">Your entries</h5>
                <div className="text-2xl font-bold font-heading text-[#20456c]/80">
                  {walletZealyEntries} <i className="ri-coupon-2-fill" />
                </div>
              </div>
            </a>
            <a
              href="https://galxe.com/ledgityyield/campaign/GCGypUABrf"
              target="_blank"
              className="relative sm:min-w-[350px] min-w-[315px] flex-grow min-h-40 border-2 border-[#20456c]/20 rounded-2xl pt-5 flex flex-col gap-2 overflow-hidden shadow-md hover:shadow-lg hover:scale-[102%] transition-all h-[200px] justify-between"
            >
              <div className="absolute top-0 right-0 bg-black rounded-bl-xl">
                <Image
                  src={galxeIcon}
                  width={30}
                  height={30}
                  alt="Galxe logo"
                  className="aspect-square"
                />
              </div>

              <h4 className="text-xl font-heading font-bold px-5">Complete tasks on Galxe</h4>

              <div className="px-8 text-[#20456c]/90 font-medium">
                New tasks on Mondays & Thursdays
                <br />
                1 Galxe point = 1 <i className="ri-coupon-2-fill" />
              </div>
              <div className="flex p-3 justify-between items-center w-full bg-[#20456c]/10">
                <h5 className="font-semibold text-lg text-[#20456c]/50">Your entries</h5>
                <div className="text-2xl font-bold font-heading text-[#20456c]/80">
                  {walletGalxeEntries} <i className="ri-coupon-2-fill" />
                </div>
              </div>
            </a>

            <a
              href="/app/pre-mining"
              className="relative sm:min-w-[350px] min-w-[315px] flex-grow min-h-40 border-2 border-[#20456c]/20 rounded-2xl pt-5 flex flex-col gap-2 overflow-hidden shadow-md hover:shadow-lg hover:scale-[102%] transition-all h-[200px] justify-between"
            >
              <div className="absolute top-0 right-0 bg-indigo-700 rounded-bl-xl w-[30px] h-[30px] inline-flex justify-center items-center">
                <i className="ri-hammer-fill text-bg " />
              </div>

              <h4 className="text-xl font-heading font-bold px-5">Participate in Pre-Mining</h4>

              <div className="px-8 text-[#20456c]/90 font-medium">
                1 USDC locked 3 months = 1 <i className="ri-coupon-2-fill" />
                <br />1 USDC locked 6 months = 2 <i className="ri-coupon-2-fill" />
                <br />1 USDC locked 12 months = 5 <i className="ri-coupon-2-fill" />
              </div>
              <div className="flex p-3 justify-between items-center w-full bg-[#20456c]/10">
                <h5 className="font-semibold text-lg text-[#20456c]/50">Your entries</h5>
                <div className="text-2xl font-bold font-heading text-[#20456c]/80">
                  {walletPreMiningEntries} <i className="ri-coupon-2-fill" />
                </div>
              </div>
            </a>
            <div className="relative sm:min-w-[350px] min-w-[315px] flex-grow min-h-40 border-2 border-[#20456c]/20 rounded-2xl pt-5 flex flex-col gap-2 overflow-hidden shadow-md justify-between grayscale opacity-70">
              <div className="absolute top-0 right-0 bg-[#1DA1F2] rounded-bl-xl w-[30px] h-[30px] inline-flex justify-center items-center">
                <i className="ri-twitter-fill text-white text-xl" />
              </div>

              <h4 className="text-xl font-heading font-bold px-5">Spread the word on Twitter</h4>

              <div className="px-8 text-[#20456c]/90 font-medium">
                Tweet with{" "}
                <span className="font-bold">
                  {" "}
                  #LedgityAirdrop #RWA
                  <br />
                  #LDY @LedgityYield
                </span>{" "}
                = 50 <i className="ri-coupon-2-fill" />
                <div className="flex flex-wrap justify-between max-w-[250px]">
                  <span className="w-1/2">
                    +1 <i className="ri-coupon-2-fill" /> per like
                  </span>
                  <span className="w-1/2">
                    +3 <i className="ri-coupon-2-fill" /> per reply
                  </span>
                  <span className="w-1/2">
                    +5 <i className="ri-coupon-2-fill" /> per RT
                  </span>
                  <span className="w-1/2">
                    +10 <i className="ri-coupon-2-fill" /> per QRT
                  </span>
                </div>
              </div>
              <div className="flex p-3 justify-between items-center w-full bg-[#20456c]/10">
                <h5 className="font-semibold text-lg text-[#20456c]/50">Your entries</h5>
                <div className="text-2xl font-bold font-heading text-[#20456c]/80">Coming Soon</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="bg-[#20456c]/10 rounded-2xl flex justify-around flex-wrap gap-10 sm:mx-10 sm:p-10 p-5">
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xl text-[#20456c]/50">Your total entries</h4>
              <span className="text-3xl font-bold text-[#20456c]/90">
                {walletTotalEntries} <i className="ri-coupon-2-fill" />
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-xl text-[#20456c]/50 text-end w-full inline-block">
                Eligible to airdrop
              </h4>
              {walletMissingEntries <= 0 ? (
                <span className="flex gap-2 items-center">
                  <span className="w-8 h-8 bg-emerald-500 rounded-full text-bg inline-flex justify-center items-center font-bold text-xl">
                    <i className="ri-check-line font-black" />
                  </span>
                  <span className="text-lg font-semibold text-[#20456c]/90">
                    Wallet is eligible
                  </span>
                </span>
              ) : (
                <span className="flex gap-2 items-center">
                  <span className="w-8 h-8 bg-red-500 rounded-full text-bg inline-flex justify-center items-center font-bold text-xl">
                    <i className="ri-close-fill font-black" />
                  </span>
                  <span className="text-lg font-semibold text-[#20456c]/90">
                    <span className="font-bold">
                      {walletMissingEntries} <i className="ri-coupon-2-fill" />
                    </span>{" "}
                    missing
                  </span>
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-[#20456c]/70 pl-1 font-medium sm:mx-10 mx-5">
            Entries counts may take up to 1h to be reflected here.
          </p>
        </div>
      </Card>
      {/* <Card
        defaultGradient={false}
        circleIntensity={0}
        animated={false}
        className="before:bg-gradient-to-tl before:from-[#20456c]/70 before:to-[#20456c] before:hover:opacity-95 before:transition-opacity w-full p-10 flex flex-col gap-6 bg-[#28a0f0]/20"
      >
        <h3 className="font-extrabold text-2xl text-center text-bg font-heading w-">
          Don&apos;t miss the kick-off! 🏁
        </h3>
        <div className="flex gap-6 items-center justify-center flex-wrap">
          <Link href="https://discord.gg/ledgityyield" target="_blank">
            <Button size="small" className="bg-[#7289da] text-white">
              <i className="ri-discord-fill mr-1.5 text-[1.36rem]"></i>Join our Discord
            </Button>
          </Link>
          <Link href="https://twitter.com/LedgityYield" target="_blank">
            <Button
              size="small"
              className="border-2 border-bg/30 bg-[#0f1419] text-bg transition-opacity hover:opacity-60"
            >
              <i className="ri-twitter-x-line mr-1.5 text-[1.29rem]"></i>Follow us on X (Twitter)
            </Button>
          </Link>
        </div>
      </Card> */}
    </div>
  );
};
