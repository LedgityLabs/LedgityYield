import { Button, Card } from "@/components/ui";
import Image from "next/image";
import { FC } from "react";
import arbitrumLogo from "~/assets/chains/arbitrum.svg";
import usdcIcon from "~/assets/tokens/usdc.png";
import ldyIcon from "~/assets/tokens/ldy.svg";
import tokenBottom from "~/assets/tokens/3d-ldy-bottom.png";
import tokenTop from "~/assets/tokens/3d-ldy-top.png";
import Link from "next/link";

import { AppLockdropParticipate } from "./AppLockdropParticipate";
import { AppLockdropProgression } from "./AppLockdropProgression";

export const AppLockdrop: FC = () => {
  const isWaiting = true;
  return (
    <div className="flex w-full flex-col gap-8 pb-8 lg:w-[830px]">
      <Card
        defaultGradient={false}
        circleIntensity={0}
        animated={false}
        className="flex w-full flex-col gap-10 bg-[#28a0f0]/20"
      >
        <div className="flex items-center justify-between p-11 pb-1 pt-12">
          <div className="flex items-center justify-center gap-4 opacity-80">
            <Image src={arbitrumLogo} alt="Arbitrum" height={50} width={50} />
            <h2 className="font-heading text-4xl font-bold text-[#20456c]">Lockdrop</h2>
          </div>
          <AppLockdropProgression />
        </div>

        <div className="flex flex-col gap-8 border-y border-y-[#28a0f0]/10 bg-[#28a0f0]/5 px-6">
          <div className="flex justify-around gap-8 px-10 ">
            <p className="pt-8 font-heading text-3xl leading-10">
              <span className="whitespace-nowrap text-center font-bold text-[#20456c]">
                Lock{" "}
                <span className="pl-1 text-[#2676ca]">
                  <Image
                    src={usdcIcon}
                    alt=""
                    width={22}
                    height={22}
                    className="-mt-[0.28rem] inline aspect-square opacity-90"
                  />
                  <span className="pl-[0.3rem] align-baseline font-extrabold">USDC</span>
                </span>{" "}
                <br />
                {/* <span className="px-2 pl-0 opacity-80">--&gt;</span> Receive{" "} */}Receive{" "}
                <span className="underline decoration-[#28a0f0]/30 decoration-4 underline-offset-2">
                  very first
                </span>{" "}
                <span className="px-1.5">
                  <Image
                    src={ldyIcon}
                    alt=""
                    width={22}
                    height={22}
                    className="-mt-[0.28rem] inline aspect-square rounded-full opacity-90"
                  />
                  <span className="bg-gradient-to-t from-fg/90 to-fg/60 bg-clip-text pl-[0.3rem]  font-extrabold text-transparent drop-shadow-md">
                    LDY
                  </span>
                </span>
              </span>
            </p>
            <Image
              src={tokenTop}
              alt=""
              width={150}
              className="self-start opacity-80 transition-opacity hover:opacity-100"
            />
          </div>
          <div className="flex justify-start gap-5 px-10">
            <Image
              src={tokenBottom}
              alt=""
              width={180}
              className="self-end opacity-80 transition-opacity hover:opacity-100"
            />
            <div className="flex flex-col gap-1 pb-8">
              <ol className="list-decimal pl-10 font-medium text-[#20456c]/70">
                <li className="py-1">
                  You get <span className="font-bold text-[#20456c]/80">USDC 100% back</span> after
                  the lock period.
                </li>
                <li className="py-1">
                  It&apos;s{" "}
                  <span className="font-bold text-[#20456c]/80">first-come-first-served</span>, so
                  don&apos;t miss your chance!
                </li>
                <li className="py-1">
                  This pool distributes{" "}
                  <span className="font-bold text-[#20456c]/80">
                    ~13% of the 6-months LDY supply
                  </span>
                  .
                </li>
              </ol>

              <Link
                href="https://docs.ledgity.finance/opportunities/arbitrum-lockdrop"
                target="_blank"
                className="pl-6 font-semibold text-[#20456c]/90 underline decoration-[#20456c]/20 underline-offset-2 transition-colors hover:text-[#20456c]"
              >
                Learn more <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>
        </div>

        {(!isWaiting && <AppLockdropParticipate />) || <div></div>}
      </Card>
      <Card
        defaultGradient={false}
        circleIntensity={0}
        animated={false}
        className="before:bg-gradient-to-tl before:from-[#20456c]/70 before:to-[#20456c] before:hover:opacity-95 before:transition-opacity w-full p-10 flex flex-col gap-5 bg-[#28a0f0]/20"
      >
        <h3 className="font-extrabold text-2xl text-center text-bg font-heading w-">
          Don&apos;t miss the kick-off!! 🏁
        </h3>
        <div className="flex gap-5 items-center justify-center">
          <Link href="/">
            <Button size="small" className="bg-[#7289da] text-white">
              <i className="ri-discord-fill mr-1.5 text-[1.36rem]"></i>Join our Discord
            </Button>
          </Link>
          <Link href="https://twitter.com/LedgityYield">
            <Button
              size="small"
              className="border-2 border-bg/30 bg-[#0f1419] text-bg transition-opacity hover:opacity-60"
            >
              <i className="ri-twitter-x-line mr-1.5 text-[1.29rem]"></i>Follow us on X (Twitter)
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
