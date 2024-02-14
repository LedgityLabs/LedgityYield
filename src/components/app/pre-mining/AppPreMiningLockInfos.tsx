import { Amount, Card } from "@/components/ui";
import { useReadPreMiningAccountsLocks, useReadPreMiningEligibleRewardsOf } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { useQueryClient } from "@tanstack/react-query";
import { FC, useEffect } from "react";
import { zeroAddress } from "viem";
import { useAccount, useBlockNumber } from "wagmi";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const AppPreMiningLockInfos: FC<Props> = ({ ...props }) => {
  const account = useAccount();

  const lockdropAddress = useContractAddress("ArbitrumPreMining");
  const { data: lockData, queryKey: lockQueryKey } = useReadPreMiningAccountsLocks({
    // @ts-ignore
    address: lockdropAddress!,
    args: [account.address || zeroAddress],
  });
  const { data: eligibleRewards, queryKey: rewardsQueryKey } = useReadPreMiningEligibleRewardsOf({
    // @ts-ignore
    address: lockdropAddress!,
    args: [account.address || zeroAddress],
  });

  // Refresh some data every 5 blocks
  const queryKeys = [lockQueryKey, rewardsQueryKey];
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();
  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n)
      queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  }, [blockNumber, ...queryKeys]);

  if (!account.address || !lockData) return null;

  return (
    <Card
      className="flex flex-col gap-10 p-10 before:bg-indigo-950/90 bg-indigo-950/20"
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
