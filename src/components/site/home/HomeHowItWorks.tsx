import { FC } from "react";
import { Button, Card, Cube, FadeIn } from "@/components/ui";

const HomeHowItWorks: FC = () => {
  return (
    <FadeIn>
      <section className="relative  flex flex-col justify-center items-center my-64">
        <Cube size="small" className="right-36 bottom-[55%]" />
        <Cube size="medium" className="left-36 top-[55%]" />

        <h3 className="text-center font-semibold text-4xl pb-20 font-heading">How it works ?</h3>
        <ol className="flex flex-wrap justify-center items-center gap-12 px-12">
          <li className="flex flex-col justify-center">
            <Card circleSize={100} defaultGradient={true} className="relative w-[250px] py-5">
              <div className="absolute -left-4 -top-5">
                <Card
                  radius="full"
                  className="text-xl h-10 w-10 before:bg-card-border-default rounded-full flex justify-center items-center"
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
            <Card circleSize={100} defaultGradient={true} className="relative w-[250px] py-5">
              <div className="absolute -left-4 -top-5">
                <Card
                  radius="full"
                  className="text-xl h-10 w-10 before:bg-card-border-default rounded-full flex justify-center items-center"
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
            <Card circleSize={100} defaultGradient={true} className="relative w-[250px] py-5">
              <div className="absolute -left-4 -top-5">
                <Card
                  radius="full"
                  className=" text-xl h-10 w-10 before:bg-card-border-default rounded-full flex justify-center items-center"
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
        </div>
      </section>
    </FadeIn>
  );
};
export default HomeHowItWorks;
