"use client";
import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from "react";
import { AllowanceTxButton, Amount, AmountInputWithLogo, Button, Spinner } from "@/components/ui";
import { Address, formatUnits, parseUnits } from "viem";
import { UseSimulateContractReturnType } from "wagmi";
import { useContractAddress } from "@/hooks/useContractAddress";
import { useSimulateLdyStakingStake } from "@/generated";
import * as Slider from "@radix-ui/react-slider";
import { StakeDurations } from "@/constants/staking";
import { getAPRCalculation } from "@/lib/getAPRCalculation";

type SafePreparation = UseSimulateContractReturnType & {
  __brand: 'safe_preparation'
};

function castPreparation(prep: any): SafePreparation {
  return {
    ...prep,
    __brand: 'safe_preparation'
  } as SafePreparation;
}

export const AppStakingPanel: FC<{
  ldyTokenSymbol: string;
  ldyTokenAddress: Address;
  ldyTokenBalance: bigint;
  ldyTokenDecimals: number;
  rewardRate: number;
  totalWeightedStake: number;
}> = ({
  ldyTokenSymbol = "LDY",
  ldyTokenAddress,
  ldyTokenBalance,
  ldyTokenDecimals,
  rewardRate,
  totalWeightedStake,
}) => {
  const ldyStakingAddress = useContractAddress("LDYStaking");

  const inputEl = useRef<HTMLInputElement>(null);
  const [depositedAmount, setDepositedAmount] = useState(0n);
  const [stakeOptionIndex, setStakeOptionIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  // Reset everything on ldyBalance change.
  useEffect(() => {
    setDepositedAmount(0n);
    setHasUserInteracted(false);
    if (inputEl.current) {
      inputEl.current.value = "0";
    }
  }, [ldyTokenBalance]);

  // Calculate APR based on stakeIndex and stakingAprInfo.
  const APR = useMemo(() => {
    return getAPRCalculation(rewardRate, totalWeightedStake, stakeOptionIndex) + "%";
  }, [stakeOptionIndex, rewardRate, totalWeightedStake]);

  const simulationResult = useSimulateLdyStakingStake({
    args: [depositedAmount, stakeOptionIndex],
  });

  const preparation = useMemo(() => castPreparation(simulationResult), [simulationResult]);

  const handlePercentageClick = (percentage: number) => {
    const amount = (ldyTokenBalance! * BigInt(percentage)) / 100n;
    setDepositedAmount(amount);
    if (inputEl.current) {
      inputEl.current.value = formatUnits(amount, ldyTokenDecimals!);
      if (!hasUserInteracted) setHasUserInteracted(true);
    }
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    try {
      setDepositedAmount(parseUnits(value || "0", ldyTokenDecimals!));
      if (!hasUserInteracted && value !== "") {
        setHasUserInteracted(true);
      } else if (value === "") {
        setHasUserInteracted(false);
      }
    } catch (err) {
      console.error("Error parsing amount:", err);
    }
  };

  return (
    <div className="flex flex-col w-full p-4 gap-y-2 h-full">
      <div className="font-heading font-bold text-xl">STAKE LDY TO GET REWARDS AND BENEFITS</div>
      <AmountInputWithLogo
        ref={inputEl}
        maxValue={ldyTokenBalance}
        decimals={ldyTokenDecimals}
        symbol={ldyTokenSymbol}
        onChange={handleAmountChange}
      />
      <div className="grid gap-4 grid-cols-4">
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => handlePercentageClick(25)}
        >
          25%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => handlePercentageClick(50)}
        >
          50%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => handlePercentageClick(75)}
        >
          75%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => handlePercentageClick(100)}
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
            {StakeDurations.map((duration, index) => (
              <span
                key={duration}
                className={`bg-gray-500 w-2 h-2 rounded-full text-sm absolute ${
                  index === 0 
                    ? "start-0 ml-2" 
                    : index === StakeDurations.length - 1
                    ? "end-0 mr-2"
                    : `inset-x-${(index + 1)}/3 -translate-x-${(index + 1)}/3`
                }`}
              >
                <span className="flex justify-center text-sm font-semibold text-gray-500 -bottom-5">
                  {duration}
                </span>
              </span>
            ))}
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
            token={ldyTokenAddress!}
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
                  suffix={ldyTokenSymbol}
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