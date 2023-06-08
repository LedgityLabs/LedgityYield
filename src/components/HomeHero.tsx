"use client";
import { FC, useLayoutEffect, useRef } from "react";
import { Button, Scroller, Card, Cube, FadeIn } from "@/components/ui";
import { clsx } from "clsx";
import { gsap } from "@/lib/gsap";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const HomeHero: FC<Props> = ({ className }) => {
  const heroSection = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (window.innerWidth > 640) {
        gsap.to(heroSection.current, {
          yPercent: -40,
          opacity: 0,
          scale: 1.4,
          scrollTrigger: {
            trigger: heroSection.current,
            start: "top top", // when the top of the trigger hits the top of the viewport
            end: "80% top", // when the 80% from to of the trigger hits the top of the viewport
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
          },
        });
      }
    });
    return () => ctx.revert(); // cleanup
  });

  return (
    <section
      className={twMerge(
        "relative min-h-[140vh]",
        "bg-[url('/assets/glow-light.webp')] bg-cover md:bg-center bg-[left_14%_bottom_0%]",
        "before:min-h-[140vh] before:absolute before:inset-0 before:bg-hero before:pointer-events-none before:opacity-[0.006] before:brightness-[250%] before:contrast-[600%]",
        "after:bg-gradient-to-b after:from-transparent after:to-bg after:absolute after:top-[100vh] after:w-screen after:h-[40vh] after:-z-0",
        className
      )}
    >
      <div
        ref={heroSection}
        className="relative  flex -mt-[92px]  flex-col min-h-screen justify-center items-center xl:gap-20 lg:gap-18 md:gap-12 gap-14"
      >
        <Cube size="tiny" className="right-12" />
        <Cube size="small" className="right-80 top-[35%] xl:block hidden" />
        <Cube size="small" className="right-14 top-10" />
        <Cube size="tiny" className="left-44 bottom-12" />
        <Cube size="small" className="left-80 bottom-[30%] xl:block hidden" />
        <Cube size="small" className="-left-16 bottom-[40%]" />
        <Cube
          size="medium"
          className="sm:block hidden lg:right-44 md:right-16 sm:-right-0  lg:bottom-[10%] sm:bottom-0"
        />
        <Cube size="medium" className="lg:block hidden left-44 top-[10%]" />
        <Cube
          size="tiny"
          className="lg:block hidden lg:right-[47%] xl:right-[35%] right-[35%] -bottom-2"
        />
        <Cube size="small" className="left-[30%] -bottom-4 xl:block hidden" />

        <h2 className="text-center leading-none font-heading lg:text-8xl sm:text-[11vw] text-[13vw] sm:block inline-flex flex-col font-bold text-slate-700 relative">
          Stable
          <span> yield for</span>
          <br className="hidden sm:block" />
          <span className="text-indigo-300 text-transparent bg-clip-text bg-gradient-to-t from-indigo-300 to-indigo-500">
            stablecoins<span className="text-slate-700">.</span>
          </span>
        </h2>
        <section>
          <div className="sm:flex hidden content-around justify-around lg:gap-16 md:gap-10 sm:gap-8">
            <Card className="relative flex bg-bg/[0.85] lg:h-40 lg:w-44 sm:h-32 sm:w-32 h-24 w-24 flex-col items-center justify-center p-6">
              <p className="mb-3 lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-bold text-fg/80">
                7%
              </p>
              <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/50 font-heading">
                APY
              </h3>
            </Card>
            <Card className="relative flex bg-bg/[0.85] lg:h-40 lg:w-44 sm:h-32 sm:w-32 h-24 w-24 flex-col items-center justify-center p-6">
              <p className="mb-3 lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-bold text-fg/80">
                ±0.1%
              </p>
              <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/50 font-heading">
                1Y stability
              </h3>
            </Card>
            <Card className="relative flex bg-bg/[0.85] lg:h-40 lg:w-44 sm:h-32 sm:w-32 h-24 w-24 flex-col items-center justify-center p-6">
              <p className="mb-3 lg:text-5xl md:text-4xl sm:text-4xl text-2xl font-bold text-fg/80">
                $8k
              </p>
              <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/50 font-heading">
                TVL
              </h3>
            </Card>
          </div>
          <div className="block sm:hidden">
            <Card>
              <ul className="flex justify-around px-[6vw] h-28">
                <li className="relative flex items-center justify-center px-[4vw] pr-[6vw]">
                  <p className="mb-3 text-4xl font-bold text-fg/80">7%</p>
                  <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/50 font-heading">
                    APR
                  </h3>
                </li>

                <li className={clsx("relative flex items-center justify-center px-[6vw]", "bg-fg/[5%]")}>
                  <p className="mb-3 text-4xl font-bold text-fg/80">±0.1%</p>
                  <h3
                    className={clsx(
                      "absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/50 font-heading",
                      "whitespace-nowrap"
                    )}
                  >
                    1Y stability
                  </h3>
                </li>
                <li className="relative flex items-center justify-center px-[4vw] pl-[6vw]">
                  <p className="mb-3 text-4xl font-bold text-fg/80">$8k</p>
                  <h3 className="absolute bottom-3 sm:text-lg text-sm font-semibold text-primary/50 font-heading">
                    TVL
                  </h3>
                </li>
              </ul>
            </Card>
          </div>
        </section>
        <div className="flex flex-row flex-wrap px-8 justify-center items-center gap-8">
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
          <Button variant="outline" size="large" onClick={() => scrollTo(0, window.innerHeight)}>
            Learn more
          </Button>
        </div>
        <Scroller className="absolute lg:bottom-11 bottom-8" />
      </div>
    </section>
  );
};
export default HomeHero;
