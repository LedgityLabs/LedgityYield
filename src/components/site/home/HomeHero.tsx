"use client";
import React, { FC, useLayoutEffect, useRef } from "react";
import { Cube, Amount } from "@/components/ui";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import anime from "animejs";
import { animateScroll } from "@/lib/animateScroll";
import { usePublicClient } from "wagmi";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const HomeHero: FC<Props> = ({ className }) => {
  const heroSection = useRef<HTMLDivElement>(null);
  const publicClient = usePublicClient();

  // Figure out if it's an Arbitrum user or not
  const isArbitrum = publicClient && [42161, 421613].includes(publicClient.chain.id);

  useLayoutEffect(() => {
    const divAnimation = anime({
      targets: heroSection.current!,
      scale: [1, 0.8],
      translateY: [0, 300],
      easing: "easeInOutCubic",
      opacity: [1, 0],
      duration: 1000,
      autoplay: false,
    });

    return animateScroll(divAnimation, heroSection.current!, "top");
  }, []);

  return (
    <section
      className={twMerge(
        "bg-[url('/assets/textures/glow-light.webp')] bg-cover bg-[left_30%_bottom_0%] md:bg-center",
        "before:bg-hero before:pointer-events-none before:absolute before:inset-0 before:min-h-[140vh] before:opacity-[0.006] before:brightness-[250%] before:contrast-[600%]",
        className,
      )}
    >
      <div
        ref={heroSection}
        className="relative flex h-full flex-col items-center justify-center gap-[7vh] sm:gap-[5vh] lg:gap-[7.5vh]"
      >
        <Cube size="tiny" className="right-12" />
        <Cube size="small" className="right-[17%] top-[45%] hidden 2xl:block" />
        <Cube size="small" className="right-14 top-[10%]" />
        <Cube size="tiny" className="bottom-12 left-44 block xl:hidden" />
        <Cube size="small" className="bottom-12 left-44 hidden xl:block" />
        <Cube size="small" className="bottom-[30%] left-80 hidden 2xl:block" />
        <Cube size="small" className="-left-16 bottom-[40%]" />
        <Cube
          size="medium"
          className="hidden sm:-right-0 sm:bottom-0 sm:block md:right-16  lg:bottom-[10%] lg:right-44"
        />
        <Cube size="medium" className="left-44 top-[10%] hidden lg:block" />
        <Cube
          size="tiny"
          className="-bottom-2 right-[35%] hidden lg:right-[47%] lg:block 2xl:right-[28%]"
        />
        <Cube size="small" className="-bottom-4 left-[30%] hidden 2xl:block" />

        <section className="flex flex-col items-center justify-center gap-[5vh]">
          <Link
            style={{
              display: !isArbitrum ? "inline-block" : "none",
            }}
            href={{
              pathname: "/app",
              query: { ref: "abar" },
            }}
          >
            <div className="overflow flex scale-90 flex-col flex-wrap overflow-hidden rounded-3xl border border-orange-200 bg-orange-50 opacity-70 drop-shadow-md backdrop-blur-md hover:opacity-80 sm:flex-row sm:flex-nowrap">
              <div className="flex items-center justify-center gap-1 whitespace-nowrap bg-gradient-to-tr from-orange-500 to-orange-700 px-4 py-2 text-lg font-bold text-white sm:rounded-3xl md:px-3 md:py-1">
                <i className="ri-fire-fill animate-pulse text-xl" />
                Linea Airdrop
              </div>
              <div className="flex items-center justify-center gap-2 px-4 py-2 text-center text-lg font-semibold text-fg/90 md:px-3 md:py-1.5 ">
                Deposit USDC and receive tokens <br className="md:hidden" />
                from 10+ Linea projects
                <i className="ri-arrow-right-line text-xl font-bold text-orange-700" />
              </div>
            </div>
          </Link>
          <Link
            style={{
              display: isArbitrum ? "inline-block" : "none",
            }}
            href={{
              pathname: "/app",
              query: { ref: "abar" },
            }}
          >
            <div className="overflow flex scale-90 flex-col flex-wrap overflow-hidden rounded-3xl border border-orange-200 bg-orange-50 opacity-70 drop-shadow-md backdrop-blur-md hover:opacity-80 sm:flex-row sm:flex-nowrap">
              <div className="flex items-center justify-center gap-1 whitespace-nowrap bg-gradient-to-tr from-orange-500 to-orange-700 px-4 py-2 text-lg font-bold text-white sm:rounded-3xl md:px-3 md:py-1">
                <i className="ri-fire-fill animate-pulse text-xl" />
                Arbitrum Lockdrop
              </div>
              <div className="flex items-center justify-center gap-2 px-4 py-2 text-center text-lg font-semibold text-fg/90 md:px-3 md:py-1.5 ">
                Lock USDC on Arbitrum and <br className="md:hidden" />
                receive very first LDY tokens
                <i className="ri-arrow-right-line text-xl font-bold text-orange-700" />
              </div>
            </div>
          </Link>
          <h2 className="relative inline-flex flex-col text-center font-heading text-[14vw] font-bold leading-none text-slate-700 sm:block sm:text-[11.5vw] md:text-[11.5vw] lg:text-[7.2rem] xl:text-[7.8rem]">
            <span className="text-[15vw] drop-shadow-xl sm:[font-size:inherit]">
              Stable <span className="whitespace-nowrap">yield for</span>
            </span>
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-t from-indigo-300 to-indigo-500 bg-clip-text text-indigo-300 text-transparent drop-shadow-md">
              stablecoins<span className="text-slate-700">.</span>
            </span>
          </h2>
        </section>
        <div className="mt-14 flex w-screen flex-col items-center justify-center xl:mt-20">
          <div className="dark-neon min-w-[700px] sm:min-w-[1300px] md:min-w-[1300px] lg:min-w-[1800px]" />
          <ul className="flex items-center justify-center gap-24 px-14 lg:mt-2 lg:gap-32">
            <li className="text-center sm:text-left">
              <Amount
                value={200000000000n}
                decimals={6}
                className="font-heading text-6xl font-bold text-slate-200/90 lg:text-7xl"
              />
              <h3 className="font-heading text-xl font-bold text-primary opacity-70">
                TVL <span className="opacity-70">(in $)</span>
              </h3>
            </li>
            <li className="hidden text-right sm:block">
              <span
                prefix="±"
                className="font-heading text-6xl font-bold text-slate-200/90 lg:text-7xl"
              >
                ±0.1%
              </span>
              <h3 className="font-heading text-xl font-bold text-primary opacity-70">
                <span className="opacity-70">(1Y)</span> Stability
              </h3>
            </li>
          </ul>
        </div>
        <div className="absolute bottom-[4vh]">
          <i className="ri-arrow-down-double-fill text-3xl text-fg/50" />
        </div>
      </div>
    </section>
  );
};
export default HomeHero;
