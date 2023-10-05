import { Card } from "@/components/ui";
import Image from "next/image";
import { FC } from "react";
import usdcIcon from "~/assets/tokens/usdc.png";
import ldyIcon from "~/assets/tokens/ldy.svg";
import tokenBottom from "~/assets/tokens/3d-ldy-bottom.png";
import tokenTop from "~/assets/tokens/3d-ldy-top.png";
import Link from "next/link";

import { AppPreMiningParticipate } from "./AppPreMiningParticipate";
// import { AppPreMiningProgression } from "./AppPreMiningProgression";

export const AppPreMining: FC = () => {
  return (
    <div className="flex max-w-full flex-col gap-8 pb-8 lg:w-[830px]">
      <Card
        defaultGradient={true}
        circleIntensity={0.07}
        animated={false}
        className="flex max-w-full flex-col gap-x-10 overflow-hidden"
      >
        {/* <div className="flex items-center md:justify-between justify-center sm:p-11 sm:pt-12 sm:pb-1 p-10 pb-5 flex-wrap gap-x-20 gap-y-10 mb-10">
          <div className="flex items-center justify-center gap-4 opacity-80">
            <Image src={arbitrumLogo} alt="Arbitrum" height={50} width={50} />
            <h2 className="font-heading text-4xl font-bold text-[#20456c]">Pre-Mining</h2>
          </div>
          <AppPreMiningProgression />
        </div> */}

        <div className="flex flex-col gap-12 border-b border-b-indigo-950/5 bg-gradient-to-tr from-bg to-primary/40 px-8 rounded-tr-[1.75rem]">
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
                  <span className="pl-[0.3rem] align-baseline font-extrabold">USDC</span>
                </span>{" "}
                <br />
                Receive{" "}
                <span className="underline decoration-indigo-700/20 decoration-4 underline-offset-2 whitespace-nowrap">
                  very first
                </span>{" "}
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
                  You get <span className="font-bold text-indigo-950/80">USDC 100% back</span> after
                  the lock period.
                </li>
                <li className="py-1">
                  It&apos;s{" "}
                  <span className="font-bold text-indigo-950/80">first-come-first-served</span>, so
                  don&apos;t miss your chance!
                </li>
                <li className="py-1">
                  This pool distributes{" "}
                  <span className="font-bold text-indigo-950/80">
                    ~12% of the 1-year LDY supply
                  </span>{" "}
                  with 6mo vesting after TGE.
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
