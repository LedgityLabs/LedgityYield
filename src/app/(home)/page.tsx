import { Button, Scroller, Card } from "@/components/ui";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { clsx } from "clsx";
import foundersoneLogo from "~/assets/partners/foundersone.png";
import risepartnersLogo from "~/assets/partners/risepartners.png";
import adanLogo from "~/assets/partners/adan.svg";
import circleLogo from "~/assets/partners/circle.png";

const Page: NextPage = () => (
  <>
    <section
      className={clsx(
        "hero min-h-[140vh] bg-[url('/assets/glow-light.png')] bg-cover bg-center",
        "before:min-h-[140vh] before:absolute before:inset-0 before:bg-hero before:pointer-events-none before:opacity-[0.006] before:bg-blend-difference before:brightness-[250%] before:contrast-[600%]",
        "after:bg-gradient-to-b after:from-transparent after:to-bg after:absolute after:top-[100vh] after:w-screen after:h-[40vh] after:-z-0"
      )}
    >
      <div className="flex -mt-[92px] relative flex-col min-h-screen justify-center items-center xl:gap-20 lg:gap-18 md:gap-12 gap-14">
        <h2 className="text-center leading-none font-heading lg:text-8xl md:text-[4.5rem] sm:text-[4rem] text-[3rem] font-bold text-slate-700">
          Stable <span className="whitespace-nowrap">yields for</span>
          <br />
          <span className="text-indigo-300 text-transparent bg-clip-text bg-gradient-to-t from-indigo-300 to-indigo-500">
            stablecoins
          </span>
          .
        </h2>
        <section className="relative flex content-around justify-around lg:gap-16 md:gap-10 sm:gap-8 gap-4">
          {/* <div className=" absolute top-8 h-1 w-screen bg-sky-200"></div> */}
          <Card className="relative flex lg:h-40 lg:w-44 sm:h-32 sm:w-32 h-24 w-24 flex-col items-center justify-center p-6">
            <p className="mb-3 lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-bold text-fg/80">$8k</p>
            <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/30">TVL</h3>
          </Card>
          <Card className="relative flex lg:h-40 lg:w-44 sm:h-32 sm:w-32 h-24 w-24 flex-col items-center justify-center p-6">
            <p className="mb-3 lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-bold text-fg/80">7%</p>
            <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/30">APR</h3>
          </Card>
          <Card className="relative flex lg:h-40 lg:w-44 sm:h-32 sm:w-32 h-24 w-24 flex-col items-center justify-center p-6">
            <p className="mb-3 lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-bold text-fg/80">±0.1%</p>
            <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/30">1Y stability</h3>
          </Card>
        </section>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8">
          <Link href="/app">
            <Button size="large">Invest now</Button>
          </Link>
          <Button variant="outline" size="large">
            Learn more
          </Button>
        </div>
        <Scroller className="absolute lg:bottom-11 bottom-8" />
      </div>
    </section>
    <div className="bg-[url('/assets/other-glow.png')] bg-cover bg-top relative">
      <section className="flex flex-col justify-center items-center -mt-64">
        <div className="flex flex-wrap justify-center gap-10 px-8 max-w-[calc(24rem*3+2.5rem*3+2*2rem)]">
          <Card className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90">
            <h3 className="text-center text-fg/90 z-10 font-bold text-[1.4rem] font-heading absolute top-7 bg-gradient-radial from-bg to-transparent">
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
          <Card className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90">
            <h3 className="text-center text-fg/90 z-10 font-bold text-[1.4rem] font-heading absolute top-7 bg-gradient-radial from-bg to-transparent">
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
          <Card className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90">
            <h3 className="text-center text-fg/90 z-10 font-bold text-[1.4rem] font-heading absolute top-7 bg-gradient-radial from-bg to-transparent">
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

          <Card className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90">
            <h3 className="text-center text-fg/90 z-10 font-bold text-[1.4rem] font-heading absolute top-7 bg-gradient-radial from-bg to-transparent">
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
          <Card className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90">
            <h3 className="text-center text-fg/90 z-10 font-bold text-[1.4rem] font-heading absolute top-7 bg-gradient-radial from-bg to-transparent">
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
          <Card className="w-96 h-[360px] flex justify-between items-center flex-col overflow-hidden relative opacity-90">
            <h3 className="text-center text-fg/90 z-10 font-bold text-[1.4rem] font-heading absolute top-7 bg-gradient-radial from-bg to-transparent">
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
        <Link href="/app">
          <Button className="mt-12" size="large">
            Browse available yields
          </Button>
        </Link>
      </section>
      <section className="flex flex-col justify-center items-center py-48">
        <h3 className="text-center font-semibold text-4xl pb-4 font-heading">How it works ?</h3>
        <ol className="flex flex-col justify-center items-center flex-wrap gap-8 p-8">
          <li>
            <Card className="p-8 flex sm:flex-row flex-col justift-center gap-8 items-center sm:w-[500px] w-full">
              <Card
                radius="full"
                className="text-xl h-12 w-12 bg-primary/80 rounded-full flex justify-center items-center"
              >
                <span className="text-primary-fg font-bold">1</span>
              </Card>
              <p className="text-xl sm:text-start text-center">
                You lend stablecoins and get wrapped coins as proof of deposit
              </p>
            </Card>
          </li>
          <li>
            <Card className="p-8 flex sm:flex-row flex-col justift-center gap-8 items-center sm:w-[500px] w-full">
              <Card
                radius="full"
                className="text-xl h-12 w-12 bg-primary/80 rounded-full flex justify-center items-center"
              >
                <span className="text-primary-fg font-bold">2</span>
              </Card>
              <p className="text-xl sm:text-start text-center">
                Your funds get allocated accross diversified DeFi and CeFi strategies
              </p>
            </Card>
          </li>
          <li>
            <Card className="p-8 flex sm:flex-row flex-col justift-center gap-8 items-center sm:w-[500px] w-full">
              <Card
                radius="full"
                className="text-xl h-12 w-12 bg-primary/80 rounded-full flex justify-center items-center"
              >
                <span className="text-primary-fg font-bold">3</span>
              </Card>
              <p className="text-xl sm:text-start text-center">You start earning stable yields while you sleep !</p>
            </Card>
          </li>
        </ol>
        <div className="flex sm:flex-row flex-col gap-8 justify-center items-center mt-8">
          <p className="text-xl font-semibold underline decoration-2 decoration-slate-400">Ready to get started ?</p>
          <Link href="/app">
            <Button size="large">Take me to the app</Button>
          </Link>
        </div>
      </section>
      <section className="pb-36 flex flex-col items-center">
        <h3 className="text-center font-semibold text-4xl pb-16 font-heading ">Our partners</h3>
        <ul className="flex flex-wrap justify-center gap-16 px-16">
          <li>
            <Link
              href="https://www.circle.com"
              target="_blank"
              className="opacity-90 hover:opacity-100 transition min-h-[60px]"
            >
              <Image src={circleLogo} alt="Circle Logo" height={60} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.risepartners.org"
              target="_blank"
              className="opacity-90 hover:opacity-100 transition min-h-[60px]"
            >
              <Image src={risepartnersLogo} alt="Rise Partners Logo" height={60} />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.adan.eu"
              target="_blank"
              className="opacity-90 hover:opacity-100 transition min-h-[60px]"
            >
              <Image src={adanLogo} alt="ADAN Logo" height={60} />
            </Link>
          </li>
          <li>
            <Link href="" target="_blank" className="opacity-90 hover:opacity-100 transition min-h-[60px]">
              <Image src={foundersoneLogo} alt="Founders One Logo" height={60} />
            </Link>
          </li>
        </ul>
      </section>
    </div>
  </>
);
export default Page;
