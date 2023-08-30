import { Amount, Card } from "@/components/ui";
import { useLockdropAccountsLocks, useLockdropEligibleRewardsOf } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const AppLockdropLockInfos: FC<Props> = ({ ...props }) => {
  const { data: walletClient } = useWalletClient();

  const lockdropAddress = useContractAddress("ArbitrumLockdrop");
  const { data: lockData } = useLockdropAccountsLocks({
    address: lockdropAddress!,
    args: [walletClient?.account.address || zeroAddress],
    watch: true,
  });
  const { data: eligibleRewards } = useLockdropEligibleRewardsOf({
    address: lockdropAddress!,
    args: [walletClient?.account.address || zeroAddress],
    watch: true,
  });

  if (!walletClient || !lockData) return null;

  return (
    <Card
      className="flex flex-col gap-10 p-10 before:bg-[#20456c]/90 bg-[#28a0f0]/20"
      defaultGradient={false}
      circleIntensity={0}
    >
      <div className="flex justify-between">
        <h3 className="font-bold text-3xl font-heading text-bg/70">Your lock</h3>

        <div className="flex gap-16">
          <div className="flex flex-col items-start">
            <Amount
              value={lockData[0]}
              decimals={6}
              suffix="USDC"
              displaySymbol={true}
              className="text-[1.92rem] text-bg/80 font-heading font-bold"
            />
            <h4 className="font-bold text-lg text-black/70">Locked amount</h4>
          </div>
          <div className="flex flex-col items-end">
            <Amount
              value={eligibleRewards}
              decimals={18}
              suffix="LDY"
              displaySymbol={true}
              className="text-[1.92rem] text-bg/80 font-heading font-bold"
            />
            <h4 className="font-bold text-lg text-black/70">Eligible rewards</h4>
          </div>
        </div>
      </div>
      <div>
        <ul>
          <li>
            <h5>Want to increase your locked amount?</h5>
            <p>Just deposit additional USDC using the above deposit input.</p>
          </li>
          <li>
            <h5>Want to extend your lock duration?</h5>
            <p>
              Depositing 1 USDC for a longer lock duration will increase your entire lock duration
            </p>
          </li>
        </ul>
      </div>
    </Card>
  );
};
