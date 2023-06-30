import { Amount, Card } from "@/components/ui";
import { useLtyDecimals, useLtyStakingGetTier, useLtyStakingTotalStaked } from "@/generated";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingExplanations: FC<Props> = ({ className }) => {
  const { data: ltyDecimals } = useLtyDecimals();
  const { data: tier1Amount } = useLtyStakingGetTier({ args: [1n] });
  const { data: tier2Amount } = useLtyStakingGetTier({ args: [2n] });
  const { data: tier3Amount } = useLtyStakingGetTier({ args: [3n] });

  return (
    <Card circleIntensity={0.07} className={twMerge("flex flex-col p-8", className)}>
      <div>
        <h2 className="text-xl font-bold text-fg/80 mb-4 font-heading">What is LTY token?</h2>
        <p className="ml-4">
          The LTY token is the utility token of the whole Ledgity ecosystem. Ledgity DeFi allows wallets
          to stake their LTY tokens against juicy advantages classified by tiers.
        </p>
        <h2 className="text-xl font-bold text-fg/80 mb-6 mt-9 font-heading">Staking tiers</h2>
        <div className="grid grid-cols-[130px,auto] gap-y-7 ml-2">
          <h3 className="flex justify-center items-center text-3xl font-bold font-heading text-primary/80 bg-primary/20 rounded-l-2xl rounded-r-sm">
            &gt;
            <Amount
              value={tier1Amount}
              decimals={ltyDecimals}
              suffix="LTY"
              displaySymbol={false}
              discardLeadingZeroes={true}
            />
          </h3>
          <div className="pl-3">
            <ul className="pl-4 list-disc">
              <li>Receive 20% APR on your stake</li>
              <li>Unlock boosts (coming soon)</li>
              <li>Community support</li>
            </ul>
          </div>
          <h3 className="flex justify-center items-center text-3xl font-bold font-heading text-primary/80 bg-primary/20 rounded-l-2xl rounded-r-sm">
            &gt;
            <Amount
              value={tier2Amount}
              decimals={ltyDecimals}
              suffix="LTY"
              displaySymbol={false}
              discardLeadingZeroes={true}
            />
          </h3>
          <div className="pl-3">
            <p className="italic">Previous tiers advantages, plus:</p>
            <ul className="pl-5 list-disc">
              <li>Free and top priority withdrawal requests</li>
              <li>Entry to private holders&apos; event</li>
              <li>Email support</li>
            </ul>
          </div>

          <h3 className="flex justify-center items-center text-3xl font-bold font-heading text-primary/80 bg-primary/20 rounded-l-2xl rounded-r-sm">
            &gt;
            <Amount
              value={tier3Amount}
              decimals={ltyDecimals}
              suffix="LTY"
              displaySymbol={false}
              discardLeadingZeroes={true}
            />
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
  );
};
