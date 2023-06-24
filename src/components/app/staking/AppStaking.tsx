import { Amount, AmountInput, Card } from "@/components/ui";
import { FC } from "react";
import * as d3 from "d3-format";

export const AppStaking: FC = () => {
  return (
    <section className="grid grid-cols-[repeat(5,1fr)] grid-rows-[repeat(8,1fr)] w-[1200px] h-[900px] gap-10 mb-10">
      <Card
        circleIntensity={0.07}
        className="flex justify-center items-center p-4 pl-10 col-span-2 row-span-2"
      >
        <div className="flex h-full flex-col justify-center items-center ">
          <h2 className="text-center text-lg font-medium text-indigo-900/80">Total staked</h2>
          <div className="h-full flex justify-center items-center text-5xl font-heavy font-heading">
            <Amount value={2388684841} />
          </div>
        </div>
        <div className="flex justify-center items-center w-full h-full ml-10 bg-primary/10 rounded-3xl text-center">
          Chart
          <br />
          (coming soon)
        </div>
      </Card>
      <Card circleIntensity={0.07} className="flex flex-col row-start-3 row-span-6 col-span-2 p-8">
        <div>
          <h2 className="text-xl font-bold text-fg/80 mb-4 font-heading">What is LTY token?</h2>
          <p className="ml-4">
            The LTY token is the utility token of the whole Ledgity ecosystem. Ledgity DeFi allows
            wallets to stake their LTY tokens against juicy advantages classified by tiers.
          </p>
          <h2 className="text-xl font-bold text-fg/80 mb-6 mt-9 font-heading">Staking tiers</h2>
          <div className="grid grid-cols-[65px,auto] gap-y-7 ml-2">
            <h3 className="flex justify-center items-center text-lg font-bold font-heading text-fg/90 bg-primary/20 rounded-l-2xl rounded-r-sm">
              &gt;0
            </h3>
            <div className="pl-3">
              <ul className="pl-4 list-disc">
                <li>Receive 20% APR on your stake</li>
                <li>Unlock boosts (coming soon)</li>
                <li>Community support</li>
              </ul>
            </div>
            <h3 className="flex justify-center items-center text-lg font-bold font-heading text-fg/90 bg-primary/20 rounded-l-2xl rounded-r-sm">
              &gt;1M
            </h3>
            <div className="pl-3">
              <p className="italic">Previous tiers advantages, plus:</p>
              <ul className="pl-5 list-disc">
                <li>Top priority in withdrawal queue</li>
                <li>Entry to private holders&apos; event</li>
                <li>Email support</li>
              </ul>
            </div>

            <h3 className="flex justify-center items-center text-lg font-bold font-heading text-fg/90 bg-primary/20 rounded-l-2xl rounded-r-sm">
              &gt;10M
            </h3>
            <div className="pl-3">
              <p className="italic">Previous tiers advantages, plus:</p>
              <ul className="pl-5 list-disc">
                <li>Voting power in DAO (coming soon)</li>
                <li>Access early opportunities offered by Ledgity team</li>
                <li>Phone / private chat support</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
      <Card
        circleIntensity={0.07}
        className="flex flex-col justify-center items-center py-4 px-10 col-start-3 row-span-2"
      >
        <h2 className="text-center text-lg font-medium text-indigo-900/80">Current APR</h2>
        <div className="h-full flex justify-center items-center text-6xl font-heavy font-heading">
          20%
        </div>
      </Card>
      <Card
        circleIntensity={0.07}
        className="flex flex-col justify-center items-center py-4 px-10 col-start-4 row-span-2"
      >
        <h2 className="text-center text-lg font-medium text-indigo-900/80">Your stake</h2>
        <div className="h-full flex justify-center items-center text-6xl font-heavy font-heading">
          <Amount value={1487512} />
        </div>
      </Card>
      <Card
        circleIntensity={0.07}
        className="flex flex-col justify-center items-center py-4 px-10 col-start-5 row-span-2"
      >
        <h2 className="text-center text-lg font-medium text-indigo-900/80 whitespace-nowrap">
          Eligible to tier
        </h2>
        <div className="h-full flex justify-center items-center text-6xl font-heavy font-heading">2</div>
      </Card>
      <Card
        circleIntensity={0.07}
        className="flex justify-between items-stretch p-10 gap-10 col-span-3 row-span-2"
      >
        <h2 className="font-heading text-xl w-24">Stake</h2>
        <AmountInput maxValue={71324654} />
      </Card>
      <Card
        circleIntensity={0.07}
        className="flex justify-between items-stretch p-10 gap-10 col-span-3 row-span-2"
      >
        <h2 className="font-heading text-xl w-24">Claim</h2>
        <AmountInput maxValue={71324654} maxName="Unclaimed rewards" />
      </Card>
      <Card
        circleIntensity={0.07}
        className="flex justify-between items-stretch p-10 gap-10 col-span-3 row-span-2"
      >
        <h2 className="font-heading text-xl w-24">Withdraw</h2>
        <AmountInput maxValue={71324654} maxName="Deposited" />
      </Card>
    </section>
  );
};
