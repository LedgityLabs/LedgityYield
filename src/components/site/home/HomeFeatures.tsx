"use client";
import { FC, useLayoutEffect, useRef } from "react";
import { Button, Card, Cube, FadeIn } from "@/components/ui";
import Link from "next/link";

const HomeFeatures: FC = () => {
  return (
    <section className="relative flex flex-col items-center justify-center">
      <Cube size="medium" className="-top-8 left-64" />
      <Cube size="large" className="-right-16 bottom-[35%]" />
      <Cube size="small" className="bottom-[15%] left-8" />

      <div className="flex max-w-[calc(24rem*3+3rem*3+2*2rem)] flex-wrap justify-center gap-12 px-8 pt-8">
        <Card
          defaultGradient={true}
          circleIntensity={0.25}
          className="relative flex h-[360px] w-96 max-w-[95vw] flex-col items-center justify-between overflow-hidden"
        >
          <h3 className="bg-gradient-radial absolute top-6 z-10 rounded-2xl from-bg to-transparent p-1 text-center font-heading text-2xl font-bold text-fg/80 backdrop-blur-md">
            Long term stability
          </h3>
          <div
            className="card absolute h-full w-full bg-fg/30 bg-card-illustrations"
            style={{
              mask: "url('/assets/features/stability.svg')",
              WebkitMask: "url('/assets/features/stability.svg')",
              maskPosition: "top center",
              WebkitMaskPosition: "top center",
            }}
          ></div>
          <p className="bg-gradient-radial absolute bottom-7 left-7 right-7 -mt-4 rounded-2xl from-bg to-transparent text-center text-[17px] font-medium text-fg/70 backdrop-blur-md">
            Benefit from stability of an institutional set up and a protocol backed by Real World
            Assets (RWA).
          </p>
        </Card>
        <Card
          defaultGradient={true}
          circleIntensity={0.25}
          className="relative flex h-[360px] w-96 max-w-[95vw] flex-col items-center justify-between overflow-hidden"
        >
          <h3 className="bg-gradient-radial absolute top-6 z-10 rounded-2xl from-bg to-transparent p-1 text-center font-heading text-2xl font-bold text-fg/80 backdrop-blur-md">
            High efficiency
          </h3>
          <div
            className="card absolute h-full w-full bg-fg/30 bg-card-illustrations"
            style={{
              mask: "url('/assets/features/efficiency.svg')",
              WebkitMask: "url('/assets/features/efficiency.svg')",
              maskPosition: "top center",
              WebkitMaskPosition: "top center",
            }}
          ></div>
          <p className="bg-gradient-radial absolute bottom-7 left-7 right-7 -mt-4 rounded-2xl from-bg to-transparent text-center text-[17px] font-medium text-fg/70 backdrop-blur-md">
            Our team of experts provide financial engineering to achieve the best risk-adjusted
            return from RWA.
          </p>
        </Card>
        <Card
          defaultGradient={true}
          circleIntensity={0.25}
          className="relative flex h-[360px] w-96 max-w-[95vw] flex-col items-center justify-between overflow-hidden"
        >
          <h3 className="bg-gradient-radial absolute top-6 z-10 rounded-2xl from-bg to-transparent p-1 text-center font-heading text-2xl font-bold text-fg/80 backdrop-blur-md">
            Diversification
          </h3>
          <div
            className="card absolute h-full w-full bg-fg/30 bg-card-illustrations"
            style={{
              mask: "url('/assets/features/diversification.svg')",
              WebkitMask: "url('/assets/features/diversification.svg')",
              maskPosition: "top center",
              WebkitMaskPosition: "top center",
            }}
          ></div>
          <p className="bg-gradient-radial absolute bottom-7 left-7 right-7 -mt-4 rounded-2xl from-bg to-transparent text-center text-[17px] font-medium text-fg/70 backdrop-blur-md">
            The collateralized portoflio of RWA is allocated accross hundreds of yield
            opportunities.
          </p>
        </Card>

        <Card
          defaultGradient={true}
          circleIntensity={0.25}
          className="relative flex h-[360px] w-96 max-w-[95vw] flex-col items-center justify-between overflow-hidden"
        >
          <h3 className="bg-gradient-radial absolute top-6 z-10 rounded-2xl from-bg to-transparent p-1 text-center font-heading text-2xl font-bold text-fg/80 backdrop-blur-md">
            Multi-chains
          </h3>
          <div
            className="card absolute h-full w-full bg-fg/30 bg-card-illustrations"
            style={{
              mask: "url('/assets/features/multichains.svg')",
              WebkitMask: "url('/assets/features/multichains.svg')",
              maskPosition: "top center",
              WebkitMaskPosition: "top center",
            }}
          ></div>
          <p className="bg-gradient-radial absolute bottom-7 left-7 right-7 -mt-4 rounded-2xl from-bg to-transparent text-center text-[17px] font-medium text-fg/70 backdrop-blur-md">
            The protocol aims to be available on most EVM chains to bring stable yield to every
            stablecoin holders.
          </p>
        </Card>
        <Card
          defaultGradient={true}
          circleIntensity={0.25}
          className="relative flex h-[360px] w-96 max-w-[95vw] flex-col items-center justify-between overflow-hidden"
        >
          <h3 className="bg-gradient-radial absolute top-6 z-10 rounded-2xl from-bg to-transparent p-1 text-center font-heading text-2xl font-bold text-fg/80 backdrop-blur-md">
            No liquidation
          </h3>
          <div
            className="card absolute h-full w-full bg-fg/30 bg-card-illustrations"
            style={{
              mask: "url('/assets/features/no-liquidations.svg')",
              WebkitMask: "url('/assets/features/no-liquidations.svg')",
              maskPosition: "top center",
              WebkitMaskPosition: "top center",
            }}
          ></div>{" "}
          <p className="bg-gradient-radial absolute bottom-7 left-7 right-7 -mt-4 rounded-2xl from-bg to-transparent text-center text-[17px] font-medium text-fg/70 backdrop-blur-md">
            Our protocol does not implement any liquidation mechanism and fees at borrowing time.
          </p>
        </Card>
        <Card
          defaultGradient={true}
          circleIntensity={0.25}
          className="relative flex h-[360px] w-96 max-w-[95vw] flex-col items-center justify-between overflow-hidden"
        >
          <h3 className="bg-gradient-radial absolute top-6 z-10 rounded-2xl from-bg to-transparent p-1 text-center font-heading text-2xl font-bold text-fg/80 backdrop-blur-md">
            Analytics
          </h3>
          <div
            className="card absolute h-full w-full bg-fg/30 bg-card-illustrations"
            style={{
              mask: "url('/assets/features/analytics.svg')",
              WebkitMask: "url('/assets/features/analytics.svg')",
              maskPosition: "top center",
              WebkitMaskPosition: "top center",
            }}
          ></div>
          <p className="bg-gradient-radial absolute bottom-7 left-7 right-7 -mt-4 rounded-2xl from-bg to-transparent text-center text-[17px] font-medium text-fg/70 backdrop-blur-md">
            The app provides you with detailed charts and statistics about your investment and the
            protocol itself.
          </p>
        </Card>
      </div>
      <Link href="/app">
        <Button className="mt-12" size="large">
          Browse available yields
        </Button>
      </Link>
    </section>
  );
};
export default HomeFeatures;
