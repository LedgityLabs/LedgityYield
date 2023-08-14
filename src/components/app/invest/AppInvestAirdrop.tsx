import { Card, Rate } from "@/components/ui";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";
import pfp from "~/assets/logo/pfp.png";
import Image, { type StaticImageData } from "next/image";

const Project = ({
  name,
  logo,
  percentage,
}: {
  name: string;
  logo: StaticImageData | null;
  percentage: number;
}) => {
  return (
    <div className="flex flex-col items-start justify-center gap-2">
      <div className="flex w-full items-center justify-center gap-2">
        <div className={twMerge("h-20 w-20 overflow-hidden rounded-2xl")}>
          {(logo && <Image src={logo} alt={name} height={150} width={150} className="" />) || (
            <div className="h-full w-full bg-fg/10"></div>
          )}
        </div>
        <Rate
          value={percentage}
          className={twMerge(
            "text-center font-heading text-2xl font-extrabold text-fg/90",
            logo === null && "text-fg/40",
          )}
        />
      </div>
      <h4
        className={twMerge(
          "font-heading text-2xl font-bold text-fg/70",
          logo === null && "text-fg/40",
        )}
      >
        {name}
      </h4>
    </div>
  );
};
interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}
export const AppInvestAirdrop: FC<Props> = ({ className }) => {
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge(
        "flex flex-col items-center justify-center gap-5 px-10 py-10 before:bg-gradient-to-t before:from-primary/90 before:via-indigo-300 before:to-primary/90",
        className,
      )}
    >
      <h3 className=" text-center font-heading text-4xl font-bold text-bg/90">
        Linea Multi-Airdrop
      </h3>
      <p className="text-center text-lg font-semibold text-bg">
        To boost USDC inflow to Linea, Ledgity Yield and its partners are
        <br />
        rewarding first USDC investors with a portion of their tokens supply.
      </p>

      <h3 className="mt-10 text-center font-heading text-2xl font-bold text-white">
        Distributed supplies (in %)
      </h3>

      <div className="inline-flex flex-col items-center gap-3 rounded-3xl bg-white/90 p-16">
        <div className="grid w-full grid-cols-3 justify-between gap-16">
          <Project name="Ledgity Yield" logo={pfp} percentage={500} />
          <Project name="Available Slot" logo={null} percentage={0} />
          <Project name="Available Slot" logo={null} percentage={0} />
          <Project name="Available Slot" logo={null} percentage={0} />
          <Project name="Available Slot" logo={null} percentage={0} />
          <Project name="Available Slot" logo={null} percentage={0} />
        </div>
      </div>

      <h3 className="mt-10 text-center font-heading text-2xl font-bold text-white">Eligibility</h3>
      <div>
        <p className="text-lg font-semibold text-white">The wallet must have:</p>
        <ol className="list-decimal pl-6 text-lg font-semibold text-white">
          <li>Deposited in Ledgity Yield USDC pool for at least 1 month</li>
          <li>Interacted with at least 1 partner DApp</li>
        </ol>
      </div>

      <h3 className="mt-10 text-center font-heading text-2xl font-bold text-white">
        Weight calculation
      </h3>
      <ul className="list-disc text-lg font-semibold text-white">
        <li>Proportional to deposited amount</li>
        <li>
          Proportional to number of interactions with partners&apos; DApps
          <ul>
            <li>+ bonus if interactions involve USDC</li>
          </ul>
        </li>
        <li>Proportional to time in Ledgity Yield USDC pool</li>
      </ul>
    </Card>
  );
};
