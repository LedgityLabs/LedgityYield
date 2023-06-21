import { FC } from "react";
import { Button, Card, Cube, FadeIn } from "@/components/ui";

const HomeFeatures: FC = () => {
  return (
    <FadeIn>
      <section className="relative flex flex-col justify-center items-center">
        <Cube size="medium" className="left-72 -top-16" />
        <Cube size="large" className="-right-16 bottom-[35%]" />
        <Cube size="small" className="left-8 bottom-[15%]" />

        <div className="flex flex-wrap justify-center gap-12 px-8 max-w-[calc(24rem*3+3rem*3+2*2rem)]">
          <Card
            defaultGradient={true}
            className="w-96 max-w-[95vw] h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
          >
            <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
              Long term stability
            </h3>
            <div
              className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
              style={{
                mask: "url('/assets/features/stability.svg')",
                WebkitMask: "url('/assets/features/stability.svg')",
                maskPosition: "top center",
                WebkitMaskPosition: "top center",
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              Benefit from stability of an institutional set up and a protocol backed by Real World
              Assets (RWA).
            </p>
          </Card>
          <Card
            defaultGradient={true}
            className="w-96 max-w-[95vw] h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
          >
            <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
              High efficiency
            </h3>
            <div
              className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
              style={{
                mask: "url('/assets/features/efficiency.svg')",
                WebkitMask: "url('/assets/features/efficiency.svg')",
                maskPosition: "top center",
                WebkitMaskPosition: "top center",
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              Our team of experts provide financial engineering to achieve the best risk-adjusted return
              from RWA.
            </p>
          </Card>
          <Card
            defaultGradient={true}
            className="w-96 max-w-[95vw] h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
          >
            <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
              Diversification
            </h3>
            <div
              className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
              style={{
                mask: "url('/assets/features/diversification.svg')",
                WebkitMask: "url('/assets/features/diversification.svg')",
                maskPosition: "top center",
                WebkitMaskPosition: "top center",
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              The collateralized portoflio of RWA is allocated accross hundreds of yield opportunities.
            </p>
          </Card>

          <Card
            defaultGradient={true}
            className="w-96 max-w-[95vw] h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
          >
            <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
              Multi-chains
            </h3>
            <div
              className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
              style={{
                mask: "url('/assets/features/multichains.svg')",
                WebkitMask: "url('/assets/features/multichains.svg')",
                maskPosition: "top center",
                WebkitMaskPosition: "top center",
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              The protocol aims to be available on most EVM chains to bring stable yield to every
              stablecoin holders.
            </p>
          </Card>
          <Card
            defaultGradient={true}
            className="w-96 max-w-[95vw] h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
          >
            <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
              No liquidation
            </h3>
            <div
              className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
              style={{
                mask: "url('/assets/features/no-liquidations.svg')",
                WebkitMask: "url('/assets/features/no-liquidations.svg')",
                maskPosition: "top center",
                WebkitMaskPosition: "top center",
              }}
            ></div>{" "}
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              Our protocol does not implement any liquidation mechanism and fees at borrowing time.
            </p>
          </Card>
          <Card
            defaultGradient={true}
            className="w-96 max-w-[95vw] h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
          >
            <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
              Analytics
            </h3>
            <div
              className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
              style={{
                mask: "url('/assets/features/analytics.svg')",
                WebkitMask: "url('/assets/features/analytics.svg')",
                maskPosition: "top center",
                WebkitMaskPosition: "top center",
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              The app provides you with detailed charts and statistics about your investment and the
              protocol itself.
            </p>
          </Card>
        </div>
        <Button
          data-tf-popup="J2ENFK9t"
          data-tf-opacity="100"
          data-tf-size="100"
          data-tf-iframe-props="title=Subscribe to app release"
          data-tf-transitive-search-params
          data-tf-medium="snippet"
          className="mt-12"
          size="large"
        >
          Browse available yields
        </Button>
      </section>
    </FadeIn>
  );
};
export default HomeFeatures;
