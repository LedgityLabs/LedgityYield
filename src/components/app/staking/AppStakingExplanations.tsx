import { Amount, Card } from "@/components/ui";
import { useGenericErc20Decimals, useLtyStakingGetTier } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.ComponentPropsWithoutRef<typeof Card> {}

export const AppStakingExplanations: FC<Props> = ({ className }) => {
  const ltyAddress = useContractAddress("LTY");
  const { data: ltyDecimals } = useGenericErc20Decimals({
    address: ltyAddress,
  });
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
          <h3 className="flex justify-center items-center text-3xl font-bold font-heading text-emerald-600/80 bg-emerald-600/20 rounded-l-2xl rounded-r-sm">
            <span className="opacity-70 inline-block mr-1">&gt;</span>
            <Amount value={tier1Amount} decimals={ltyDecimals} suffix="LTY" displaySymbol={false} />
          </h3>
          <div className="pl-3">
            <ul className="pl-4 list-disc">
              <li>Receive 20% APR on your stake</li>
              <li>Unlock L-Tokens boosts (coming soon)</li>
              <li>Prioritary email support</li>
            </ul>
          </div>

          <h3 className="flex justify-center items-center text-3xl font-bold font-heading text-cyan-600/80 bg-cyan-600/20 rounded-l-2xl rounded-r-sm">
            <span className="opacity-70 inline-block mr-1">&ge;</span>
            <Amount value={tier2Amount} decimals={ltyDecimals} suffix="LTY" displaySymbol={false} />
          </h3>
          <div className="pl-3">
            <p className="italic">Previous tiers advantages, plus:</p>
            <ul className="pl-5 list-disc">
              <li>Free and top priority withdrawal requests</li>
              <li>Entry to private holders&apos; event</li>
              <li>Private chat support</li>
            </ul>
          </div>

          <h3 className="flex justify-center items-center text-3xl font-bold font-heading text-orange-600/80 bg-orange-600/20 rounded-l-2xl rounded-r-sm">
            <span className="opacity-70 inline-block mr-1 ">&ge;</span>
            <Amount value={tier3Amount} decimals={ltyDecimals} suffix="LTY" displaySymbol={false} />
          </h3>
          <div className="pl-3">
            <p className="italic">Previous tiers advantages, plus:</p>
            <ul className="pl-5 list-disc">
              <li>Voting power in DAO (coming soon)</li>
              <li>Access early opportunities offered by Ledgity team</li>
              <li>Phone support</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};
