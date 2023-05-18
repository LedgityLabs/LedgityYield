import { Button, Scroller, Card } from "@/components/ui";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import usdcToken from "~/assets/tokens/usdc.png";
import analytics from "~/assets/analytics.png";
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
      <div className="flex -mt-[92px] relative flex-col min-h-screen justify-center items-center">
        <h2 className="text-center font-heading text-8xl font-bold text-slate-700">
          Stable yields for
          <br />
          <span className="text-indigo-300 text-transparent bg-clip-text bg-gradient-to-t from-indigo-300 to-indigo-500">
            stablecoins
          </span>
          .
        </h2>
        <section className="relative my-20 flex content-around justify-around gap-16">
          {/* <div className=" absolute top-8 h-1 w-screen bg-sky-200"></div> */}
          <Card className="relative flex h-40 w-44 flex-col items-center justify-center p-6">
            <p className="mb-3 text-5xl font-bold text-fg/80">$8k</p>
            <h3 className="absolute bottom-3 text-lg  font-semibold text-primary/30">
              TVL
            </h3>
          </Card>
          <Card className="relative flex h-40 w-44 flex-col items-center justify-center p-6">
            <p className="mb-3 text-5xl font-bold text-fg/80">7%</p>
            <h3 className="absolute bottom-3 text-lg  font-semibold text-primary/30">
              APY
            </h3>
          </Card>
          <Card className="relative flex h-40 w-44 flex-col items-center justify-center p-6">
            <p className="mb-3 text-5xl font-bold text-fg/80">±0.1%</p>
            <h3 className="absolute bottom-3 text-lg  font-semibold text-primary/30">
              1Y stability
            </h3>
          </Card>
        </section>
        <div className="flex gap-8">
          <Link href="/app">
            <Button size="large">Invest now</Button>
          </Link>
          <Button variant="outline" size="large">
            Learn more
          </Button>
        </div>
        {/* <div className="flex gap-3 justify-center items-center text-xl font-semibold mt-4 text-slate-500">
        Available tokens:
        <Image src={usdcToken} alt="USDC token logo" width={30} height={30} />
      </div> */}
        <Scroller className="absolute bottom-11" />
      </div>
    </section>
    <div className="bg-[url('/assets/other-glow.png')] bg-cover bg-top relative">
      <section className="flex flex-col justify-center items-center -mt-56">
        <div className="grid grid-cols-3 gap-12 px-8 ">
          <div>
            <Card className="w-96 flex justify-between flex-col overflow-hidden opacity-90">
              <Image className="invert opacity-90" src={analytics} alt="todo" />
              <h3 className="mb-2 text-center mt-6 text-fg/90 font-bold text-[1.3rem] font-heading">
                Long term stability
              </h3>
              <p className="p-6 pt-0 pb-7 text-lg text-center">
                Thanks to our fund being backed by Real World Assets, we record
                very few variations on announced yield rates.
              </p>
            </Card>
          </div>
          <div>
            <Card className="w-96 flex justify-between flex-col overflow-hidden opacity-90">
              <Image className="invert opacity-90" src={analytics} alt="todo" />
              <h3 className="mb-2 text-center mt-6 text-fg/90 font-bold text-[1.3rem] font-heading">
                High efficiency
              </h3>
              <p className="p-6 pt-0 pb-7 text-lg text-center">
                Our financial experts are constantly optimizing strategies to
                provide you with highest rates at lowest risks.
              </p>
            </Card>
          </div>
          <div>
            <Card className="w-96 flex justify-between flex-col overflow-hidden opacity-90">
              <Image className="invert opacity-90" src={analytics} alt="todo" />
              <h3 className="mb-2 text-center mt-6 text-fg/90 font-bold text-[1.3rem] font-heading">
                Diversified portofolio
              </h3>
              <p className="p-6 pt-0 pb-7 text-lg text-center">
                Lent funds are allocated accross multiple DeFi and CeFi
                strategies to provide you with resilient yields.
              </p>
            </Card>
          </div>
          <div>
            <Card className="w-96 flex justify-between flex-col overflow-hidden opacity-90">
              <Image className="invert opacity-90" src={analytics} alt="todo" />
              <h3 className="mb-2 text-center mt-6 text-fg/90 font-bold text-[1.3rem] font-heading">
                Detailed analytics
              </h3>
              <p className="p-6 pt-0 pb-7 text-lg text-center">
                The app provides you with detailed charts and statistics about
                your investment and the protocol itself.
              </p>
            </Card>
          </div>
          <div>
            <Card className="w-96 flex justify-between flex-col overflow-hidden opacity-90">
              <Image className="invert opacity-90" src={analytics} alt="todo" />
              <h3 className="mb-2 text-center mt-6 text-fg/90 font-bold text-[1.3rem] font-heading">
                Heavily audited
              </h3>
              <p className="p-6 pt-0 pb-7 text-lg text-center">
                Our fund contract (holding 95% of deposited assets) is based on
                Gnosis Safe, a renewed multi-audited solution.
              </p>
            </Card>
          </div>
          <div>
            <Card className="w-96 flex justify-between flex-col overflow-hidden opacity-90">
              <Image className="invert opacity-90" src={analytics} alt="todo" />
              <h3 className="mb-2 text-center mt-6 text-fg/90 font-bold text-[1.3rem] font-heading">
                Multi-chains
              </h3>
              <p className="p-6 pt-0 pb-7 text-lg text-center">
                The protocol is available on Polygon and Ethereum. We plan to
                deploy it on other chains in the near future.
              </p>
            </Card>
          </div>
        </div>
        <Link href="/app">
          <Button className="mt-12" size="large">
            Browse available yields
          </Button>
        </Link>
      </section>
      <section className="flex flex-col justify-center items-center py-48">
        <h3 className="text-center font-semibold text-4xl pb-4 font-heading">
          How it works ?
        </h3>
        <ol className="flex flex-col justify-center items-center flex-wrap">
          <li className="p-4">
            <Card className="p-8 flex gap-8 items-center w-[500px]">
              <Card
                radius="full"
                className="text-xl h-12 w-12 bg-primary/80 rounded-full flex justify-center items-center"
              >
                <span className="text-primary-fg font-bold">1</span>
              </Card>
              <p className="text-xl">
                You lend stablecoins and get wrapped coins as proof of deposit
              </p>
            </Card>
          </li>
          <li className="p-4">
            <Card className="p-8 flex gap-8 items-center w-[500px]">
              <Card
                radius="full"
                className="text-xl h-12 w-12 bg-primary/80 rounded-full flex justify-center items-center"
              >
                <span className="text-primary-fg font-bold">2</span>
              </Card>
              <p className="text-xl">
                Your funds get allocated accross diversified DeFi and CeFi
                strategies
              </p>
            </Card>
          </li>
          <li className="basis-full p-4 flex justify-center">
            <Card className="p-8 flex gap-8 items-center w-[500px]">
              <Card
                radius="full"
                className="text-xl h-12 w-12 bg-primary/80 rounded-full flex justify-center items-center"
              >
                <span className="text-primary-fg font-bold">3</span>
              </Card>
              <p className="text-xl">
                You start earning stable yields while you sleep !
              </p>
            </Card>
          </li>
        </ol>
        <div className="flex gap-8 justify-center items-center mt-8">
          <p className="text-xl font-semibold underline decoration-2 decoration-slate-400">
            Ready to get started ?
          </p>
          <Link href="/app">
            <Button size="large">Take me to the app</Button>
          </Link>
        </div>
      </section>
      <section className="pb-36 flex flex-col items-center">
        <h3 className="text-center font-semibold text-4xl pb-16 font-heading ">
          Our partners
        </h3>
        <ul className="flex justify-center gap-16">
          <li>
            <Image src={circleLogo} alt="Circle Logo" height={60} />
          </li>
          <li>
            <Image
              src={risepartnersLogo}
              alt="Rise Partners Logo"
              height={60}
            />
          </li>
          <li>
            <Image src={adanLogo} alt="ADAN Logo" height={60} />
          </li>
          <li>
            <Image src={foundersoneLogo} alt="Founders One Logo" height={60} />
          </li>
        </ul>
      </section>
    </div>
  </>
);
export default Page;
