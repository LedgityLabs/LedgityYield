"use client";
import { Button, Scroller, Card } from "@/components/ui";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import foundersoneLogo from "~/assets/partners/foundersone.png";
import risepartnersLogo from "~/assets/partners/risepartners.png";
import adanLogo from "~/assets/partners/adan.svg";
import circleLogo from "~/assets/partners/circle.png";
import { motion } from "framer-motion";

const Page: NextPage = () => (
  <>
    <section
      className={clsx(
        "hero min-h-[140vh] bg-[url('/assets/glow-light.png')] bg-cover bg-center",
        "before:min-h-[140vh] before:absolute before:inset-0 before:bg-hero before:pointer-events-none before:opacity-[0.006] before:bg-blend-difference before:brightness-[250%] before:contrast-[600%]",
        "after:bg-gradient-to-b after:from-transparent after:to-bg after:absolute after:top-[100vh] after:w-screen after:h-[40vh] after:-z-0"
      )}
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="flex -mt-[92px] relative flex-col min-h-screen justify-center items-center xl:gap-20 lg:gap-18 md:gap-12 gap-14"
      >
        <h2 className="text-center leading-none font-heading lg:text-8xl md:text-[4.5rem] sm:text-[4rem] text-[3rem] font-bold text-slate-700">
          Stable <span className="whitespace-nowrap">yields for</span>
          <br />
          <span className="text-indigo-300 text-transparent bg-clip-text bg-gradient-to-t from-indigo-300 to-indigo-500">
            stablecoins
          </span>
          .
        </h2>
        <section className="relative flex content-around justify-around lg:gap-16 md:gap-10 sm:gap-8 gap-4">
          <Card className="relative flex bg-bg/[0.85] lg:h-40 lg:w-44 sm:h-32 sm:w-32 h-24 w-24 flex-col items-center justify-center p-6">
            <p className="mb-3 lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-bold text-fg/80">$8k</p>
            <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/30">TVL</h3>
          </Card>
          <Card className="relative flex bg-bg/[0.85] lg:h-40 lg:w-44 sm:h-32 sm:w-32 h-24 w-24 flex-col items-center justify-center p-6">
            <p className="mb-3 lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-bold text-fg/80">7%</p>
            <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/30">APR</h3>
          </Card>
          <Card className="relative flex bg-bg/[0.85] lg:h-40 lg:w-44 sm:h-32 sm:w-32 h-24 w-24 flex-col items-center justify-center p-6">
            <p className="mb-3 lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-bold text-fg/80">±0.1%</p>
            <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/30">1Y stability</h3>
          </Card>
        </section>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          {/* <Link href="/app"> */}
          <Button
            size="large"
            data-tf-popup="J2ENFK9t"
            data-tf-opacity="100"
            data-tf-size="100"
            data-tf-iframe-props="title=Subscribe to app release"
            data-tf-transitive-search-params
            data-tf-medium="snippet"
          >
            Invest now
          </Button>
          {/* </Link> */}
          <a href="#features">
            <Button variant="outline" size="large">
              Learn more
            </Button>
          </a>
        </div>
        <Scroller id="features" className="absolute lg:bottom-11 bottom-8" />
      </motion.div>
    </section>
    <div className="bg-[url('/assets/other-glow.png')] bg-cover bg-top relative pb-32">
      <section className="flex flex-col justify-center items-center -mt-64">
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
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              Our institutional set up backed by RWAs allows offered yields to record very few variations through time.
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
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              Our team of experts provide financial engineering to achieve the best risk-adjusted return from RWA.
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
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              The collateralized portoflio of RWA assets is allocated accross hundreds of yield opportunities
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
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              The protocol aims to be available on most EVM chains to bring stable yield to every stablecoin holders.
            </p>
          </Card>
          <Card
            defaultGradient={true}
            className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90"
          >
            <h3 className="text-center text-fg/80 z-10 font-bold text-2xl font-heading absolute top-6 bg-gradient-radial from-bg to-transparent p-1">
              No liquidations
            </h3>
            <div
              className="card bg-card-illustrations bg-fg/30 h-full w-full absolute"
              style={{
                mask: "url('/assets/features/no-liquidations.svg')",
              }}
            ></div>{" "}
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              Our protocol does not implement any liquidation mechanism. Lorem ipsum dolor sit amet, consectetur.
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
              }}
            ></div>
            <p className="absolute bottom-7 left-7 right-7 -mt-4 text-fg/80 text-lg text-center bg-gradient-radial from-bg to-transparent">
              The app provides you with detailed charts and statistics about your investment and the protocol itself.
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
      <section className="flex flex-col justify-center items-center py-64">
        <h3 className="text-center font-semibold text-4xl pb-20 font-heading">How it works ?</h3>
        <ol className="flex flex-wrap justify-center items-center gap-12 px-12">
          <li className="flex flex-col justify-center">
            <Card className="relative w-[250px] py-5">
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
            <Card className="relative w-[250px] py-5">
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
            <Card className="relative w-[250px] py-5">
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
        <div className="flex gap-6 justify-center items-center mt-20">
          <p className="text-xl text-center font-semibold underline decoration-[3px] decoration-slate-300">
            Want to learn more ?
          </p>
          <Link href="/">
            <Button variant="outline" size="large">
              Read our whitepaper
            </Button>
          </Link>
        </div>
      </section>
      <section className="pb-64 flex flex-col items-center">
        <h3 className="text-center font-semibold text-4xl pb-16 font-heading ">Ready to get started ?</h3>
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
      <section className="pb-36 flex flex-col items-center">
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
            <Link href="" target="_blank" className="opacity-80 hover:opacity-100 transition min-h-[60px]">
              <Image src={foundersoneLogo} alt="Founders One Logo" height={60} />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  </>
);
export default Page;
