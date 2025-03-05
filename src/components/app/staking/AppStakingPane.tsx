import { StakeDurations } from "@/data/oldConstants";
// Components
import { StakeTx } from "@/components/contracts";
import { AmountInputWithLogo, Button } from "@/components/ui";
import * as Slider from "@radix-ui/react-slider";
// Hooks
import { useMemo, useRef, useState } from "react";
// Functions
import { getAPRCalculation } from "@/functions/getAPRCalculation";
import { getTypedContractAddress } from "@/functions/getContractAddress";
import { formatUnits, parseUnits } from "viem";
// Types
import { TokenInfo } from "@/types";

export function AppStakingPane({
  ldyTokenData,
  ldyTokenBalance,
  rewardRate,
  totalWeightedStake,
}: {
  ldyTokenData: TokenInfo;
  ldyTokenBalance: bigint;
  rewardRate: number;
  totalWeightedStake: number;
}) {
  const [depositedAmount, setDepositedAmount] = useState(0n);
  const [stakeOptionIndex, setStakeOptionIndex] = useState(0);
  const safeLdyTokenBalance = ldyTokenBalance || 0n;

  function handleSetPercent(percent: bigint) {
    setDepositedAmount((safeLdyTokenBalance! * percent) / 100n);
  }

  // Calculate APR based on stakeIndex and stakingAprInfo.
  const APR = useMemo(
    () => getAPRCalculation(rewardRate, totalWeightedStake, stakeOptionIndex),
    [stakeOptionIndex, rewardRate, totalWeightedStake],
  );

  return (
    <div className="flex flex-col w-full p-4 gap-y-2 h-full">
      <div className="font-heading font-bold text-xl">
        STAKE LDY TO GET REWARDS AND BENEFITS
      </div>
      <AmountInputWithLogo
        maxValue={safeLdyTokenBalance}
        decimals={ldyTokenData.decimals}
        symbol={ldyTokenData.symbol}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setDepositedAmount(parseUnits(e.target.value, ldyTokenData.decimals));
        }}
      />
      <div className="grid gap-4 grid-cols-4">
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => handleSetPercent(25n)}
        >
          25%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => handleSetPercent(50n)}
        >
          50%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => handleSetPercent(75n)}
        >
          75%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => handleSetPercent(100n)}
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
          <div className="text-4xl font-bold">{`${APR} %`}</div>
          <div className="text-xl text-gray">APR</div>
        </div>
        <div className="flex flex-col items-center">
          <StakeTx
            buttonText="STAKE LDY"
            disabled={!depositedAmount}
            params={{
              amount: formatUnits(depositedAmount, ldyTokenData.decimals),
              tokenDecimals: ldyTokenData.decimals,
              stakeDurationIndex: stakeOptionIndex,
            }}
            approveChecks={[
              {
                symbol: ldyTokenData.symbol,
                token: ldyTokenData.address,
                tokenDecimals: ldyTokenData.decimals,
                spender: getTypedContractAddress("LDYStaking"),
                amount: formatUnits(depositedAmount, ldyTokenData.decimals),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
