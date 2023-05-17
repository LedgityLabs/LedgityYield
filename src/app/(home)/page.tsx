import { Button, Scroller, Card } from "@/components/ui";
import { type NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import usdcToken from "~/assets/tokens/usdc.png";

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
        <Card
          variant="borderless"
          glowSize="small"
          className="relative flex h-40 w-44 flex-col items-center justify-center p-6"
        >
          <p className="mb-3 text-5xl font-bold text-fg/80">$8k</p>
          <h3 className="absolute bottom-3 text-lg  font-semibold text-primary/30">
            TVL
          </h3>
        </Card>
        <Card
          variant="borderless"
          glowSize="small"
          className="relative flex h-40 w-44 flex-col items-center justify-center p-6"
        >
          <p className="mb-3 text-5xl font-bold text-fg/80">7%</p>
          <h3 className="absolute bottom-3 text-lg  font-semibold text-primary/30">
            APY
          </h3>
        </Card>
        <Card
          variant="borderless"
          glowSize="small"
          className="relative flex h-40 w-44 flex-col items-center justify-center p-6"
        >
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
    <section className="flex justify-center">
      <div className="w-[70vw] grid grid-cols-3 gap-12 py-40">
        <Card className="h-64">A</Card>
        <Card className="h-64">B</Card>
        <Card className="h-64">C</Card>
        <Card className="h-64">D</Card>
        <Card className="h-64">E</Card>
        <Card className="h-64">F</Card>
      </div>
    </section>
  </>
);
export default Page;
