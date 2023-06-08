"use client";
import { Button, Card, Cube } from "@/components/ui";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import foundersoneLogo from "~/assets/partners/foundersone.png";
import delubacLogo from "~/assets/partners/delubac.png";
import risepartnersLogo from "~/assets/partners/risepartners.png";
import adanLogo from "~/assets/partners/adan.svg";
import circleLogo from "~/assets/partners/circle.png";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomeHero from "@/components/HomeHero";

gsap.registerPlugin(ScrollTrigger);

const Page: NextPage = () => {
  return (
    <>
      <HomeHero />
      <div className="bg-[url('/assets/other-glow.png')] bg-cover bg-top relative pb-32 pt-48">
        <div className="relative -mt-[33rem]">
          <span id="features" className="absolute md:-top-24"></span>
          <section className="fadein relative flex flex-col justify-center items-center ">
            <Cube size="medium" className="left-72 -top-16" />
            <Cube size="large" className="-right-16 bottom-[35%]" />
            <Cube size="small" className="left-8 bottom-[15%]" />
            <div className="flex flex-wrap justify-center gap-12 px-8 max-w-[calc(24rem*3+3rem*3+2*2rem)]">
              <Card
                defaultGradient={true}
                className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
              >
                <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
                  Long term stability
                </h3>
                <div
                  className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
                  style={{
                    mask: "url('/assets/features/stability.svg')",
                    WebkitMask: "url('/assets/features/stability.svg')",
                  }}
                ></div>
                <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
                  Benefit from stability of an institutional set up and a protocol backed by Real World
                  Assets (RWA)
                </p>
              </Card>
              <Card
                defaultGradient={true}
                className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
              >
                <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
                  High efficiency
                </h3>
                <div
                  className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
                  style={{
                    mask: "url('/assets/features/efficiency.svg')",
                    WebkitMask: "url('/assets/features/efficiency.svg')",
                  }}
                ></div>
                <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
                  Our team of experts provide financial engineering to achieve the best risk-adjusted
                  return from RWA.
                </p>
              </Card>
              <Card
                defaultGradient={true}
                className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
              >
                <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
                  Diversification
                </h3>
                <div
                  className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
                  style={{
                    mask: "url('/assets/features/diversification.svg')",
                    WebkitMask: "url('/assets/features/diversification.svg')",
                  }}
                ></div>
                <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
                  The collateralized portoflio of RWA is allocated accross hundreds of yield
                  opportunities.
                </p>
              </Card>

              <Card
                defaultGradient={true}
                className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
              >
                <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
                  Multi-chains
                </h3>
                <div
                  className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
                  style={{
                    mask: "url('/assets/features/multichains.svg')",
                    WebkitMask: "url('/assets/features/multichains.svg')",
                  }}
                ></div>
                <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
                  The protocol aims to be available on most EVM chains to bring stable yield to every
                  stablecoin holders.
                </p>
              </Card>
              <Card
                defaultGradient={true}
                className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
              >
                <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
                  No liquidation
                </h3>
                <div
                  className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
                  style={{
                    mask: "url('/assets/features/no-liquidations.svg')",
                    WebkitMask: "url('/assets/features/no-liquidations.svg')",
                  }}
                ></div>{" "}
                <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
                  Our protocol does not implement any liquidation mechanism and fees at borrowing time.
                </p>
              </Card>
              <Card
                defaultGradient={true}
                className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
              >
                <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
                  Analytics
                </h3>
                <div
                  className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
                  style={{
                    mask: "url('/assets/features/analytics.svg')",
                    WebkitMask: "url('/assets/features/analytics.svg')",
                  }}
                ></div>
                <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
                  The app provides you with detailed charts and statistics about your investment and the
                  protocol itself.
                </p>
              </Card>
            </div>
            {/* <Link href="/app"> */}
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
            {/* </Link> */}
          </section>
        </div>
        <section className="fadein flex flex-col justify-center items-center py-64">
          <Cube size="small" className="right-36 bottom-[55%]" />
          <Cube size="medium" className="left-36 top-[55%]" />

          <h3 className="text-center font-semibold text-4xl pb-20 font-heading">How it works ?</h3>
          <ol className="flex flex-wrap justify-center items-center gap-12 px-12">
            <li className="flex flex-col justify-center">
              <Card defaultGradient={true} className="relative w-[250px] py-5">
                <div className="absolute -left-4 -top-5">
                  <Card
                    radius="full"
                    className="text-xl h-10 w-10 bg-card-border-default rounded-full flex justify-center items-center"
                  >
                    <span className="text-primary-fg font-bold">1</span>
                  </Card>
                </div>
                <p className="text-xl text-center w-full font-medium text-fg/90">Deposit stablecoins</p>
              </Card>
              <p className="inline-flex items-center justify-center h-full -ml-2 pt-4 text-fg/50 text-sm font-medium tracking-wide">
                USDC, EUROC, and more!
              </p>
            </li>
            <li className="flex flex-col justify-center">
              <Card defaultGradient={true} className="relative w-[250px] py-5">
                <div className="absolute -left-4 -top-5">
                  <Card
                    radius="full"
                    className="text-xl h-10 w-10 bg-card-border-default rounded-full flex justify-center items-center"
                  >
                    <span className="text-primary-fg font-bold">2</span>
                  </Card>
                </div>
                <p className="text-xl text-center w-full font-medium text-fg/90">Receive L-Tokens</p>
              </Card>
              <p className="inline-flex items-center justify-center h-full -ml-2 pt-4 text-fg/50 text-sm font-medium tracking-wide">
                E.g., LUSDC for USDC
              </p>
            </li>
            <li className="flex flex-col justify-center">
              <Card defaultGradient={true} className="relative w-[250px] py-5">
                <div className="absolute -left-4 -top-5">
                  <Card
                    radius="full"
                    className=" text-xl h-10 w-10 bg-card-border-default rounded-full flex justify-center items-center"
                  >
                    <span className="text-primary-fg font-bold">3</span>
                  </Card>
                </div>
                <p className="text-xl text-center w-full font-medium text-fg/90">Enjoy stable yield !</p>
              </Card>
              <p className="inline-flex items-center justify-center h-full -ml-2 pt-4 text-fg/50 text-sm font-medium tracking-wide">
                (Backed by RWA)
              </p>
            </li>
          </ol>
          <div className="flex flex-wrap gap-6 px-6 justify-center items-center mt-20">
            <p className="text-xl text-center font-semibold underline decoration-[3px] decoration-slate-300">
              Want to learn more ?
            </p>
            {/* <Link href="/"> */}
            <Button
              data-tf-popup="J2ENFK9t"
              data-tf-opacity="100"
              data-tf-size="100"
              data-tf-iframe-props="title=Subscribe to app release"
              data-tf-transitive-search-params
              data-tf-medium="snippet"
              variant="outline"
              size="large"
            >
              Read our whitepaper
            </Button>
            {/* </Link> */}
          </div>
        </section>
        <section className="fadein relative pb-64 flex flex-col items-center">
          <div className="absolute right-48 bottom-[10%] backdrop-blur-mg opacity-[38%] animate-[spin_19s_ease-in-out_infinite] -z-20 blur-[2px] hover:blur-none">
            <Card defaultGradient={true} className="cube w-40 h-40  opacity-[38%] "></Card>
          </div>
          <h3 className="text-center font-semibold text-4xl pb-16 font-heading ">
            Ready to get started ?
          </h3>
          {/* <Link href="/app"> */}
          <Button
            data-tf-popup="J2ENFK9t"
            data-tf-opacity="100"
            data-tf-size="100"
            data-tf-iframe-props="title=Subscribe to app release"
            data-tf-transitive-search-params
            data-tf-medium="snippet"
            size="large"
          >
            Take me to the app
          </Button>
          {/* </Link> */}
        </section>
        <section className="fadein pb-36 flex flex-col items-center">
          <Cube size="medium" className="left-16 -bottom-40" />

          <h3 className="text-center font-semibold text-4xl pb-16 font-heading ">Our partners</h3>
          <ul className="flex flex-wrap justify-center gap-16 px-16">
            <li>
              <Link
                href="https://www.circle.com"
                target="_blank"
                className="opacity-80 hover:opacity-100 transition min-h-[60px]"
              >
                <Image src={circleLogo} alt="Circle Logo" height={60} />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.risepartners.org"
                target="_blank"
                className="opacity-80 hover:opacity-100 transition min-h-[60px]"
              >
                <Image src={risepartnersLogo} alt="Rise Partners Logo" height={60} />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.adan.eu"
                target="_blank"
                className="opacity-80 hover:opacity-100 transition min-h-[60px]"
              >
                <Image src={adanLogo} alt="ADAN Logo" height={60} />
              </Link>
            </li>
            <li>
              <Link
                href="https://foundersdao.io/"
                target="_blank"
                className="opacity-80 hover:opacity-100 transition min-h-[60px]"
              >
                <Image src={foundersoneLogo} alt="Founders One Logo" height={60} />
              </Link>
            </li>
            <li>
              <Link
                href="https://www.delubac.com/"
                target="_blank"
                className="opacity-80 hover:opacity-100 transition min-h-[60px]"
              >
                <Image src={delubacLogo} alt="Founders One Logo" height={60} />
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
};
export default Page;
