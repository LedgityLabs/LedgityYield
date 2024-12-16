import { Card, TokenLogo } from "@/components/ui";
import Image from "next/image";
import { FC } from "react";
import usdcIcon from "~/assets/tokens/usdc.png";
import ldyIcon from "~/assets/tokens/ldy.svg";
import tokenBottom from "~/assets/tokens/3d-ldy-bottom.png";
import tokenTop from "~/assets/tokens/3d-ldy-top.png";
import Link from "next/link";

import { AppPreMiningParticipate } from "./AppPreMiningParticipate";

export const AppPreMining: FC = () => {
  return (
    <div className="relative flex max-w-full flex-col pb-8 lg:w-[830px] gap-0 items-center">
      <div className="flex items-center justify-center gap-2 px-4 py-1.5 bg-slate-700 text-slate-50 rounded-full absolute z-[50] -top-4 border-slate-200 border font-semibold drop-shadow-lg">
        <i className="ri-calendar-close-fill" />
        This event has ended
      </div>
      <Card
        defaultGradient={true}
        circleIntensity={0.07}
        animated={false}
        className="flex max-w-full flex-col gap-x-10 overflow-hidden"
      >
        <div className="flex flex-col gap-12 border-b border-b-indigo-950/5 bg-gradient-to-tr from-bg to-primary/40 px-8 rounded-tr-[1.75rem] opacity-80 brightness-75 blur-[1px]">
          <div className="flex flex-wrap-reverse justify-around gap-x-10">
            <p className="sm:pt-12 pt-10 font-heading min-[350px]:text-4xl text-3xl leading-10">
              <span className="sm:text-center text-left font-bold text-indigo-950/75">
                Lock{" "}
                <span className="pl-1 text-[#2676ca]">
                  <Image
                    src={usdcIcon}
                    alt=""
                    width={24}
                    height={24}
                    className="-mt-[0.28rem] inline aspect-square opacity-90"
                  />
                  <span className="pl-[0.3rem] align-baseline font-extrabold">
                    USDC
                  </span>
                </span>{" "}
                <br />
                Receive{" "}
                <span className="px-1.5 whitespace-nowrap">
                  <Image
                    src={ldyIcon}
                    alt=""
                    width={24}
                    height={24}
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
              className="self-end opacity-80 transition-opacity hover:opacity-100 min-[830px]:block hidden"
            />
          </div>
          <div className="flex justify-around flex-wrap-reverse gap-x-2 sm:px-10 px-3">
            <Image
              src={tokenBottom}
              alt=""
              width={180}
              className="self-start opacity-80 transition-opacity hover:opacity-100"
            />
            <div className="flex flex-col gap-1 pb-12">
              <ol className="list-decimal sm:pl-10 pl-6 font-medium text-indigo-950/70 max-w-[470px]">
                <li className="py-1">
                  You get{" "}
                  <span className="font-bold text-indigo-950/80">
                    USDC 100% back
                  </span>{" "}
                  after the lock period.
                </li>
                <li className="py-1">
                  It&apos;s{" "}
                  <span className="font-bold text-indigo-950/80">
                    first-come-first-served
                  </span>
                  , so don&apos;t miss your chance!
                </li>
                <li className="py-1">
                  This pool distributes{" "}
                  <span className="font-bold text-indigo-950/80">
                    ~12% of the 1-year LDY supply
                  </span>
                </li>
              </ol>

              <Link
                href="https://docs.ledgity.finance/opportunities/pre-mining"
                target="_blank"
                className="pl-6 font-semibold text-indigo-950/90 underline decoration-indigo-950/20 underline-offset-2 transition-colors hover:text-indigo-950"
              >
                Learn more <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>
        </div>

        <AppPreMiningParticipate />
      </Card>
    </div>
  );
};
