import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from "react";
import { AllowanceTxButton, Amount, AmountInputWithLogo, Button, Spinner } from "@/components/ui";
import { erc20Abi, formatUnits, parseUnits, zeroAddress } from "viem";
import { UseSimulateContractReturnType, useAccount, useReadContract } from "wagmi";
import { useContractAddress } from "@/hooks/useContractAddress";
import { useReadLTokenDecimals, useReadLdyDecimals, useSimulateLdyStakingStake } from "@/generated";
import * as Slider from "@radix-ui/react-slider";
import { useGetStakingAprById, useGetUserStakingsByAddress } from "@/services/graph";
import { STAKING_APR_INFO_ID, StakeDurations } from "@/constants/staking";
import { useAPYCalculation } from "@/hooks/useAPYCalculation";

export const AppStakingPane: FC = () => {
  const account = useAccount();
  const ldySymbol = "LDY";
  const ldyTokenAddress = useContractAddress(ldySymbol);
  const ldyStakingAddress = useContractAddress("LDYStaking");
  const { data: ldyDecimals } = useReadLdyDecimals();
  const { data: ldyBalance, queryKey } = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    address: ldyTokenAddress,
    args: [account.address || zeroAddress],
  });

  const inputEl = useRef<HTMLInputElement>(null);
  const [depositedAmount, setDepositedAmount] = useState(0n);
  const [stakeOptionIndex, setStakeOptionIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const {
    data: stakingAprInfo,
    refetch: refetchStakingAPR,
    isFetching: isFetchingAPR,
  } = useGetStakingAprById(STAKING_APR_INFO_ID);

  // Reset everything whenever user ldy balance is changed.
  useEffect(() => {
    refetchStakingAPR();
    setDepositedAmount(0n);
    setHasUserInteracted(false);
    if (inputEl && inputEl.current) {
      inputEl.current.value = "0";
    }
  }, [ldyBalance]);

  // Calculate APY based on stakeIndex and stakingAprInfo.
  const APY = useMemo(() => {
    if (stakingAprInfo && stakingAprInfo.stakingAPRInfo) {
      return useAPYCalculation(stakingAprInfo.stakingAPRInfo.APR, true, stakeOptionIndex) + "%";
    } else {
      return "-%";
    }
  }, [stakeOptionIndex, stakingAprInfo]);

  const preparation = useSimulateLdyStakingStake({
    args: [depositedAmount, stakeOptionIndex],
  });
  return (
    <div className="flex flex-col w-full p-4 gap-y-2 h-full">
      <div className="font-heading font-bold text-xl">STAKE LDY TO GET REWARDS AND BENEFITS</div>
      <AmountInputWithLogo
        ref={inputEl}
        maxValue={ldyBalance}
        decimals={ldyDecimals}
        symbol={ldySymbol}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setDepositedAmount(parseUnits(e.target.value, ldyDecimals!));
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
            setDepositedAmount((ldyBalance! * 25n) / 100n);
            if (inputEl.current)
              inputEl.current.value = formatUnits((ldyBalance! * 25n) / 100n, ldyDecimals!);
          }}
        >
          25%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => {
            setDepositedAmount((ldyBalance! * 50n) / 100n);
            if (inputEl.current)
              inputEl.current.value = formatUnits((ldyBalance! * 50n) / 100n, ldyDecimals!);
          }}
        >
          50%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => {
            setDepositedAmount((ldyBalance! * 75n) / 100n);
            if (inputEl.current)
              inputEl.current.value = formatUnits((ldyBalance! * 75n) / 100n, ldyDecimals!);
          }}
        >
          75%
        </Button>
        <Button
          size="small"
          variant="outline"
          className="hover:bg-primary-fg"
          onClick={() => {
            setDepositedAmount(ldyBalance!);
            if (inputEl.current) inputEl.current.value = formatUnits(ldyBalance!, ldyDecimals!);
          }}
        >
          MAX
        </Button>
      </div>

      <div className="py-8">
        <Slider.Root
          className="relative flex content-start items-center select-none touch-none w-full h-5"
          value={[stakeOptionIndex]}
          max={4}
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
            <span className="bg-gray-500 w-2 h-2 rounded-full text-sm absolute start-1/4 -translate-x-1/4 rtl:translate-x-1/4">
              <span className="flex justify-center text-sm font-semibold text-gray-500 -bottom-5">
                {StakeDurations[1]}
              </span>
            </span>
            <span className="bg-gray-500 w-2 h-2 rounded-full text-sm absolute start-2/4 -translate-x-2/4 rtl:translate-x-2/4">
              <span className="flex justify-center text-sm font-semibold text-gray-500 -bottom-5">
                {StakeDurations[2]}
              </span>
            </span>
            <span className="bg-gray-500 w-2 h-2 rounded-full text-sm absolute start-3/4 -translate-x-3/4 rtl:translate-x-3/4">
              <span className="flex justify-center text-sm font-semibold text-gray-500 -bottom-5">
                {StakeDurations[3]}
              </span>
            </span>
            <span className="bg-gray-500 w-2 h-2 mr-2 rounded-full text-sm absolute end-0">
              <span className="flex justify-center text-sm font-semibold text-gray-500 -bottom-5">
                {StakeDurations[4]}
              </span>
            </span>
            {/* <Slider.Range className="absolute rounded-full h-full w-full" /> */}
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
          <div className="text-4xl font-bold">{(isFetchingAPR && <Spinner />) || APY}</div>
          <div className="text-xl text-gray">APY</div>
        </div>
        <div className="flex flex-col items-center">
          <AllowanceTxButton
            size="medium"
            preparation={preparation as UseSimulateContractReturnType}
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
                  decimals={ldyDecimals}
                  suffix={ldySymbol}
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
