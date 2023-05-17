import { Button, Scroller, Card } from "@/components/ui";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import usdcToken from "~/assets/tokens/usdc.png";
import analytics from "~/assets/analytics.png";

const Page: NextPage = () => (
  <>
    <section className="hero relative flex min-h-screen -mt-[92px] flex-col justify-center items-center bg-[url('/assets/glow-light.png')] bg-cover bg-center bg-fixed">
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
    </section>
    <section className="flex justify-center py-36">
      <div className="grid grid-cols-3 gap-12 gap-x-16 px-8 ">
        <div>
          <h3 className="text-center font-semibold text-[1.35rem] pb-4 font-heading">
            Long term stability
          </h3>
          <Card className="w-96 h-72 flex justify-between flex-col overflow-hidden">
            <p className="p-6">
              Thanks to our fund being backed by Real World Assets, we record
              very few variations on announced yield rates.
            </p>
            <Image src={analytics} alt="todo" />
          </Card>
        </div>
        <div>
          <h3 className="text-center font-semibold text-[1.35rem] pb-4 font-heading">
            High efficiency
          </h3>
          <Card className="w-96 h-72 flex justify-between flex-col overflow-hidden">
            <p className="p-6">
              Our team of financial experts are constantly optimizing strategies
              to provide you with highest rates at lowest risks.
            </p>
            <Image src={analytics} alt="todo" />
          </Card>
        </div>
        <div>
          <h3 className="text-center font-semibold text-[1.35rem] pb-4 font-heading">
            Diversified portofolio
          </h3>
          <Card className="w-96 h-72 flex justify-between flex-col overflow-hidden">
            <p className="p-6">
              Deposited stablecoins are allocated accross multiple DeFi and CeFi
              strategies to provide you with resilient yields.
            </p>
            <Image src={analytics} alt="todo" />
          </Card>
        </div>
        <div>
          <h3 className="text-center font-semibold text-[1.35rem] pb-4 font-heading">
            Detailed analytics
          </h3>
          <Card className="w-96 h-72 flex justify-between flex-col overflow-hidden">
            <p className="p-6">
              The app provides you with detailed charts and statistics about
              your investment and the protocol itself.
            </p>
            <Image src={analytics} alt="todo" />
          </Card>
        </div>
        <div>
          <h3 className="text-center font-semibold text-[1.35rem] pb-4 font-heading">
            Heavily audited
          </h3>
          <Card className="w-96 h-72 flex justify-between flex-col overflow-hidden">
            <p className="p-6">
              Our fund contract (which holds 95% of deposited assets) is based
              on Gnosis Safe, a renewed and multi-audited solution.
            </p>
            <Image src={analytics} alt="todo" />
          </Card>
        </div>
        <div>
          <h3 className="text-center font-semibold text-[1.35rem] pb-4 font-heading">
            Multi-chains
          </h3>
          <Card className="w-96 h-72 flex justify-between flex-col overflow-hidden">
            <p className="p-6">
              The protocol is currently available on Polygon and Ethereum. We
              plan to deploy it on other chains in the near future.
            </p>
            <Image src={analytics} alt="todo" />
          </Card>
        </div>
      </div>
    </section>
    <section className="flex flex-col justify-center items-center mb-36">
      <h3 className="text-center font-semibold text-4xl pb-4 font-heading">
        How it works ?
      </h3>
      <ol className="flex justify-center items-center flex-wrap">
        <li className="p-4">
          <Card className="p-8 flex gap-8 items-center w-[500px]">
            <Card
              radius="full"
              className="text-xl h-12 w-12 bg-primary/80 rounded-full flex justify-center items-center"
            >
              <span className="text-primary-fg font-bold">1</span>
            </Card>
            <p className="text-xl">
              You deposit stablecoins and get wrapped coins as proof of deposit
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
  </>
);
export default Page;
