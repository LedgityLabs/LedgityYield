import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from "react";
import { AllowanceTxButton, Amount, AmountInputWithLogo, Button } from "@/components/ui";
import { Address, formatUnits, parseUnits } from "viem";
import { UseSimulateContractReturnType } from "wagmi";
import { QueryKey } from "@tanstack/react-query";
import { useContractAddress } from "@/hooks/useContractAddress";
import { useSimulateLdyStakingStake } from "@/generated";
import * as Slider from "@radix-ui/react-slider";
import { StakeDurations } from "@/constants/staking";
import { getAPRCalculation } from "@/lib/getAPRCalculation";

interface IUserStakingInfo {
  // Add properties as needed
}

export const AppStakingPoolPanel: FC<{
  poolInfo: {
    stakedAmount: bigint;
    unStakeAt: bigint;
    duration: bigint;
    rewardPerTokenPaid: bigint;
    rewards: bigint;
  };
  poolIndex: number;
  ldyTokenDecimals: number;
  userStakingInfo: IUserStakingInfo | undefined;
  rewardsArray: readonly bigint[] | undefined;  // Changed to readonly
  rewardRate: number;
  totalWeightedStake: number;
  getUserStakesQuery: QueryKey;
  ldyTokenBalanceQuery: QueryKey;
  rewardsArrayQuery: QueryKey;
}> = ({
  poolInfo,
  poolIndex,
  ldyTokenDecimals,
  userStakingInfo,
  rewardsArray,
  rewardRate,
  totalWeightedStake,
  getUserStakesQuery,
  ldyTokenBalanceQuery,
  rewardsArrayQuery,
}) => {
  const ldyStakingAddress = useContractAddress("LDYStaking");

  const inputEl = useRef<HTMLInputElement>(null);
  const [depositedAmount, setDepositedAmount] = useState(0n);
  const [stakeOptionIndex, setStakeOptionIndex] = useState(poolIndex);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Reset everything on ldyBalance change.
  useEffect(() => {
    // Reset input field
    setDepositedAmount(0n);
    setHasUserInteracted(false);
    if (inputEl && inputEl.current) {
      inputEl.current.value = "0";
    }
  }, [ldyTokenBalanceQuery]);

  // Calculate APR based on stakeIndex and stakingAprInfo.
  const APR = useMemo(() => {
    return getAPRCalculation(rewardRate, totalWeightedStake, stakeOptionIndex) + "%";
  }, [stakeOptionIndex, rewardRate, totalWeightedStake]);

  const preparation = useSimulateLdyStakingStake({
    args: [depositedAmount, stakeOptionIndex],
  }) as UseSimulateContractReturnType;

  return (
    <div className="flex flex-col w-full p-4 gap-y-2 h-full">
      <div className="font-heading font-bold text-xl">STAKE LDY TO GET REWARDS AND BENEFITS</div>
      <AmountInputWithLogo
        ref={inputEl}
        maxValue={poolInfo.stakedAmount}
        decimals={ldyTokenDecimals}
        symbol="LDY"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setDepositedAmount(parseUnits(e.target.value, ldyTokenDecimals));
          if (hasUserInteracted === false) setHasUserInteracted(true);
          if (e.target.value === "") setHasUserInteracted(false);
        }}
      />
      <div className="grid gap-4 grid-cols-4">
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => {
            const newAmount = (poolInfo.stakedAmount * 25n) / 100n;
            setDepositedAmount(newAmount);
            if (inputEl.current)
              inputEl.current.value = formatUnits(newAmount, ldyTokenDecimals);
          }}
        >
          25%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => {
            const newAmount = (poolInfo.stakedAmount * 50n) / 100n;
            setDepositedAmount(newAmount);
            if (inputEl.current)
              inputEl.current.value = formatUnits(newAmount, ldyTokenDecimals);
          }}
        >
          50%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => {
            const newAmount = (poolInfo.stakedAmount * 75n) / 100n;
            setDepositedAmount(newAmount);
            if (inputEl.current)
              inputEl.current.value = formatUnits(newAmount, ldyTokenDecimals);
          }}
        >
          75%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => {
            setDepositedAmount(poolInfo.stakedAmount);
            if (inputEl.current)
              inputEl.current.value = formatUnits(poolInfo.stakedAmount, ldyTokenDecimals);
          }}
        >
          MAX
        </Button>
      </div>

      <div className="py-8">
        <Slider.Root
          className="relative flex content-start items-center select-none touch-none w-full h-5"
          value={[stakeOptionIndex]}
          max={3}
          step={1}
          onValueChange={(value: number[]) => {
            setStakeOptionIndex(value[0]);
          }}
        >
          <Slider.Track className="bg-border relative flex items-center grow rounded-full h-1">
            <span className="bg-gray-500 w-2 h-2 ml-2 rounded-full align-middle text-sm absolute start-0">
              <span className="flex justify-center text-sm font-semibold text-gray-500 -bottom-5">
                {StakeDurations[0]}
              </span>
            </span>
            <span className="bg-gray-500 w-2 h-2 rounded-full text-sm absolute inset-x-1/3 -translate-x-1/3">
              <span className="flex justify-center text-sm font-semibold text-gray-500 -bottom-5">
                {StakeDurations[1]}
              </span>
            </span>
            <span className="bg-gray-500 w-2 h-2 rounded-full text-sm absolute inset-x-2/3 -translate-x-2/3">
              <span className="flex justify-center text-sm font-semibold text-gray-500 -bottom-5">
                {StakeDurations[2]}
              </span>
            </span>
            <span className="bg-gray-500 w-2 h-2 mr-2 rounded-full text-sm absolute end-0">
              <span className="flex justify-center text-sm font-semibold text-gray-500 -bottom-5">
                {StakeDurations[3]}
              </span>
            </span>
          </Slider.Track>
          <Slider.Thumb
            className="block px-1 rounded-lg bg-primary text-sm text-primary-fg border-indigo-200 border-2 focus:ring-2 hover:cursor-pointer"
            aria-label="Volume"
          >
            {StakeDurations[stakeOptionIndex]}M
          </Slider.Thumb>
        </Slider.Root>
      </div>

      <div className="grid gap-4 grid-cols-2 h-full content-center">
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold">{APR}</div>
          <div className="text-xl text-gray">APR</div>
        </div>
        <div className="flex flex-col items-center">
          <AllowanceTxButton
            size="medium"
            preparation={preparation}
            token={ldyStakingAddress!}
            spender={ldyStakingAddress!}
            amount={depositedAmount}
            disabled={depositedAmount === 0n}
            hasUserInteracted={hasUserInteracted}
            transactionSummary={
              <span>
                Deposit{" "}
                <Amount
                  value={depositedAmount}
                  decimals={ldyTokenDecimals}
                  suffix="LDY"
                  displaySymbol={true}
                  className="text-indigo-300 underline underline-offset-4 decoration-indigo-300 decoration-2 whitespace-nowrap"
                />{" "}
              </span>
            }
          >
            STAKE LDY
          </AllowanceTxButton>
        </div>
      </div>
    </div>
  );
};