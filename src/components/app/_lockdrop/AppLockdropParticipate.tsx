"use client";
import { ChangeEvent, FC, useRef, useState } from "react";
import {
  AllowanceTxButton,
  Amount,
  AmountInput,
  RadioGroup,
  RadioGroupItem,
  Rate,
} from "@/components/ui";
import {
  useGenericErc20BalanceOf,
  useLTokenUnderlying,
  useLockdropLock,
  usePrepareLockdropLock,
} from "@/generated";
import { useWalletClient } from "wagmi";
import { useContractAddress } from "@/hooks/useContractAddress";
import { parseUnits, zeroAddress } from "viem";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const AppLockdropParticipate: FC<Props> = ({ ...props }) => {
  const { data: walletClient } = useWalletClient();

  // Retrieve addresses and balances
  const lTokenAddress = useContractAddress("LUSDC");
  const lockdropAddress = useContractAddress("ArbitrumLockdrop");
  const { data: underlyingAddress } = useLTokenUnderlying({ address: lTokenAddress! });
  const { data: underlyingBalance } = useGenericErc20BalanceOf({
    address: underlyingAddress,
    args: [walletClient?.account.address || zeroAddress],
    watch: true,
  });

  // Retrieve input data and prepare transaction
  const inputEl = useRef<HTMLInputElement>(null);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [depositedAmount, setDepositedAmount] = useState(parseUnits("100", 6));
  const [lockDuration, setLockDuration] = useState(12);
  const preparation = usePrepareLockdropLock({
    address: lockdropAddress!,
    args: [depositedAmount, lockDuration],
  });

  // Compute received LDY amount and % of allocation
  const maxWeight = parseUnits((5_000_000 * 12).toString(), 6);
  const weight = depositedAmount * BigInt(lockDuration);
  const distributedLDY = parseUnits((1_500_000).toString(), 18);
  let receivedLDY = (distributedLDY * weight) / maxWeight;
  let receivedAllocation = (Number(receivedLDY) / Number(distributedLDY)) * 100;

  // Cap received LDY and allocation to max
  if (receivedAllocation > 100) receivedAllocation = 100;
  if (receivedLDY > distributedLDY) receivedLDY = distributedLDY;

  return (
    <div className="flex justify-center gap-12 p-12 pt-2" {...props}>
      <div className="flex flex-col justify-end gap-3">
        <div className="flex items-end gap-6">
          <p className="pb-3 text-lg font-bold text-[#20456c]">Lock duration</p>
          <RadioGroup
            defaultValue="12"
            onValueChange={(value) => setLockDuration(Number.parseInt(value))}
            className="flex items-center justify-center gap-6"
          >
            <RadioGroupItem
              value="3"
              id="3m"
              className="[data-state='unchecked']]:text-red-500 flex aspect-square h-12 w-12 items-center justify-center rounded-2xl text-[#0472B9]"
            >
              <label htmlFor="3m" className="pointer-events-none relative font-heading">
                <div className="absolute -top-10 left-0 right-0 flex items-center justify-center">
                  <span className="rounded-lg bg-gradient-to-tr from-[#CD7F32] to-[#CD7F32]/70 px-1.5 py-1 font-heading text-sm font-semibold leading-none text-bg">
                    x3
                  </span>
                </div>
                3M
              </label>
            </RadioGroupItem>
            <RadioGroupItem
              value="6"
              id="6m"
              className="[data-state='unchecked']]:text-red-500 flex aspect-square h-12 w-12 items-center justify-center rounded-2xl text-[#0472B9]"
            >
              <label htmlFor="6m" className="pointer-events-none relative font-heading">
                <div className="absolute -top-10 left-0 right-0 flex items-center justify-center">
                  <span className="rounded-lg bg-gradient-to-tr from-[#8c8c8c] to-[#8c8c8c]/70 px-1.5 py-1 font-heading text-sm font-semibold leading-none text-bg">
                    x6
                  </span>
                </div>
                6M
              </label>
            </RadioGroupItem>
            <RadioGroupItem
              value="12"
              id="12m"
              className="[data-state='unchecked']]:text-red-500 flex aspect-square h-12 w-12 items-center justify-center rounded-2xl text-[#0472B9]"
            >
              <label htmlFor="12" className="pointer-events-none relative font-heading">
                <div className="absolute -top-10 left-0 right-0 flex items-center justify-center">
                  <span className="rounded-lg bg-gradient-to-tr from-[#DAA520] to-[#DAA520]/70  px-1.5 py-1 font-heading text-sm font-semibold leading-none text-bg">
                    x12
                  </span>
                </div>
                1Y
              </label>
            </RadioGroupItem>
          </RadioGroup>
        </div>
        <div className="mt-6 flex flex-nowrap items-start justify-center gap-4">
          <AmountInput
            defaultValue="100"
            ref={inputEl}
            maxValue={underlyingBalance}
            maxToBottom={true}
            decimals={6}
            symbol="USDC"
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setDepositedAmount(parseUnits(e.target.value, 6));
              if (hasUserInteracted === false) setHasUserInteracted(true);
              if (e.target.value === "") setHasUserInteracted(false);
            }}
            className="w-64"
          />
          <AllowanceTxButton
            size="medium"
            // @ts-ignore
            preparation={preparation}
            token={underlyingAddress!}
            spender={lTokenAddress!}
            amount={depositedAmount}
            disabled={depositedAmount === 0n}
            hasUserInteracted={hasUserInteracted}
            // Display error if trying to lock more than hardcap
            parentIsError={depositedAmount > parseUnits((5_000_000).toString(), 6)}
            parentError={"Lockdrop is capped to 5M USDC"}
            className="bg-[#0472B9] transition-colors hover:bg-[#0472B9]/90"
            transactionSummary={
              <span>
                Deposit{" "}
                <Amount
                  value={depositedAmount}
                  decimals={6}
                  suffix="USDC"
                  displaySymbol={true}
                  className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
                />{" "}
                against{" "}
                <Amount
                  value={depositedAmount}
                  decimals={6}
                  suffix="LUSDC"
                  displaySymbol={true}
                  className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
                />
              </span>
            }
          >
            Deposit
          </AllowanceTxButton>
        </div>
      </div>
      <div className=" flex flex-col items-center justify-center gap-5 rounded-3xl border border-[#28a0f0]/20 bg-[#28a0f0]/10 p-5 w-64">
        <div>
          <p className="text-center font-medium text-[#20456c]/40">You&apos;ll receive</p>
          <Amount
            value={receivedLDY}
            decimals={18}
            suffix="LDY"
            className="text-center text-3xl font-bold text-[#0472B9]"
          />
        </div>
        <hr className="w-24 border-2 border-[#20456c]/10" />
        <div>
          <p className="text-center text-2xl font-bold text-[#0472B9]/60">
            <Rate value={receivedAllocation} isUD7x3={false} highPrecision={true} />
          </p>
          <p className="text-center font-medium text-[#20456c]/40">Of total allocation</p>
        </div>
      </div>
    </div>
  );
};
