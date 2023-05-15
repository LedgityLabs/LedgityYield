import { Button, Scroller } from "@/components/ui";
import { type NextPage } from "next";

const Page: NextPage = () => (
  <>
    <section className="relative flex min-h-screen -mt-[92px] flex-col items-center bg-[url('/assets/glow.png')] bg-cover bg-center">
      <h2 className=" mt-52 text-center font-heading text-7xl font-bold text-slate-700">
        Invest stablecoins into
        <br />
        <span className=" text-indigo-300">real world assets</span>.
      </h2>
      <section className="relative mt-20 flex content-around justify-around">
        {/* <div className=" absolute top-8 h-1 w-screen bg-sky-200"></div> */}
        <article className=" relative mx-8 flex h-40 w-40 flex-col items-center justify-center rounded-3xl bg-indigo-300 bg-opacity-10 px-6 py-6 backdrop-blur-lg text-fg/90 shadow-md shadow-slate-200">
          <p className="mb-3 text-5xl font-bold">$8k</p>
          <h3 className="absolute bottom-3 text-lg  font-semibold text-indigo-200">
            TVL
          </h3>
        </article>
        <article className=" relative mx-8 flex h-40 w-40 flex-col items-center justify-center rounded-3xl bg-indigo-300 bg-opacity-10 px-6 py-6 backdrop-blur-lg text-fg/90 shadow-md shadow-slate-200">
          <p className="mb-3 text-5xl font-bold">5%</p>
          <h3 className="absolute bottom-3 text-lg  font-semibold text-indigo-200">
            APY
          </h3>
        </article>
        <article className=" relative mx-8 flex h-40 w-40 flex-col items-center justify-center rounded-3xl bg-indigo-300 bg-opacity-10 px-6 py-6 backdrop-blur-lg text-fg/90 shadow-md shadow-slate-200">
          <p className="mb-3 text-5xl font-bold">±0.1%</p>
          <h3 className="absolute bottom-3 text-lg  font-semibold text-indigo-200">
            1Y stability
          </h3>
        </article>
      </section>
      <div className="flex gap-8 mt-20">
        <Button size="large">Invest now</Button>
        <Button variant="outline" size="large">
          Learn more
        </Button>
      </div>
      <Scroller className="absolute bottom-11" />
    </section>
  </>
);
export default Page;
