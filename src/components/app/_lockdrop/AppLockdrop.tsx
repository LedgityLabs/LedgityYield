"use client";

import {
  AllowanceTxButton,
  Amount,
  AmountInput,
  Card,
  RadioGroup,
  RadioGroupItem,
  Rate,
} from "@/components/ui";
import Image from "next/image";
import { ChangeEvent, FC, useRef, useState } from "react";
import arbitrumLogo from "~/assets/chains/arbitrum.svg";
import usdcIcon from "~/assets/tokens/usdc.png";
import ldyIcon from "~/assets/logo/pfp.png";
import tokenBottom from "~/assets/tokens/3d-ldy-bottom.png";
import tokenTop from "~/assets/tokens/3d-ldy-top.png";
import Link from "next/link";
import {
  useGenericErc20BalanceOf,
  useLTokenDecimals,
  useLTokenUnderlying,
  usePrepareLTokenDeposit,
} from "@/generated";
import { useWalletClient } from "wagmi";
import { useContractAddress } from "@/hooks/useContractAddress";
import { parseUnits, zeroAddress } from "viem";

export const AppLockdrop: FC = () => {
  const progression = 0.5;
  const { data: walletClient } = useWalletClient();
  const lTokenAddress = useContractAddress(`LUSDC`);
  const { data: underlyingAddress } = useLTokenUnderlying({ address: lTokenAddress! });
  const { data: underlyingBalance } = useGenericErc20BalanceOf({
    address: underlyingAddress,
    args: [walletClient?.account.address || zeroAddress],
    watch: true,
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  const inputEl = useRef<HTMLInputElement>(null);
  const [depositedAmount, setDepositedAmount] = useState(0n);
  const [lockDuration, setLockDuration] = useState(3);
  const preparation = usePrepareLTokenDeposit({
    address: "0x0",
    args: [depositedAmount],
  });

  return (
    <div className="flex w-full flex-col gap-8 pb-8 lg:w-[800px]">
      <Card
        defaultGradient={true}
        circleIntensity={0.07}
        className="flex w-full flex-col gap-10 bg-[#28a0f0]/20"
      >
        <div className="flex items-center justify-between p-11 pb-1 pt-12">
          <div className="flex items-center justify-center gap-4 opacity-80">
            <Image src={arbitrumLogo} alt="Arbitrum" height={50} width={50} />
            <h2 className="font-heading text-4xl font-bold text-[#20456c]">Lockdrop</h2>
          </div>
          <div className="relative -mt-3 flex flex-col items-end gap-1">
            <div className="relative mt-7 h-[0.9rem] w-80 rounded-md rounded-r-none border border-r-0 border-fg/20">
              <div className="absolute -right-[1px] -top-6 drop-shadow-lg">
                <div className="absolute -bottom-[1.3rem] right-0 z-10 h-8 w-0.5 rounded-full bg-fg/50"></div>
                <div className="relative z-10 h-4 w-5 rounded-sm rounded-br-none bg-[url('/assets/textures/checkboard.png')] bg-cover"></div>
              </div>
              <div
                className="relative h-full rounded-l-[0.340rem] bg-gradient-to-l from-[#0472B9] to-[#0472B9]/50 transition-[width] !duration-[1500ms]"
                style={{ width: progression * 100 + "%" }}
              >
                <div className="absolute -right-[1px] -top-7 flex animate-pulse items-center gap-2">
                  <div className="absolute -bottom-[1.25rem] right-0 z-10 h-8 w-0.5  rounded-full bg-[#0472B9]"></div>
                  <div className="whitespace-nowrap text-xs font-semibold text-fg/60 opacity-90">
                    <Amount value={123456780009n} decimals={6} className="text-[#0472B9]" /> /{" "}
                    <Amount value={5000000000000n} decimals={6} />
                  </div>
                  <div className="rounded-md rounded-br-none bg-[#0472B9] p-1 font-heading text-xs font-bold leading-none text-bg ">
                    {(progression * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold text-fg/70">
              Only <span className="font-bold text-fg/90">28</span> days left.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-10 border-y border-y-[#28a0f0]/10 bg-[#28a0f0]/5 pr-6">
          <div className="flex justify-around gap-10 px-10 ">
            <p className="pt-10 font-heading text-3xl leading-10">
              <span className="whitespace-nowrap text-center font-bold text-[#20456c]">
                Lock{" "}
                <span className="pl-1 text-[#2676ca]">
                  <Image
                    src={usdcIcon}
                    alt=""
                    width={22}
                    height={22}
                    className="-mt-[0.28rem] inline aspect-square opacity-90"
                  />
                  <span className="pl-[0.3rem] align-baseline font-extrabold">USDC</span>
                </span>{" "}
                <br />
                {/* <span className="px-2 pl-0 opacity-80">--&gt;</span> Receive{" "} */}Receive{" "}
                <span className="underline decoration-[#28a0f0]/30 decoration-4 underline-offset-2">
                  very first
                </span>{" "}
                <span className="px-1.5">
                  <Image
                    src={ldyIcon}
                    alt=""
                    width={22}
                    height={22}
                    className="-mt-[0.28rem] inline aspect-square rounded-full opacity-90"
                  />
                  <span className="bg-gradient-to-t from-fg/90 to-fg/50 bg-clip-text pl-[0.3rem]  font-extrabold text-transparent drop-shadow-md">
                    LDY
                  </span>
                </span>
              </span>
            </p>
            <Image
              src={tokenTop}
              alt=""
              width={150}
              className="self-start opacity-80 transition-opacity hover:opacity-100"
            />
          </div>
          <div className="flex justify-start gap-5 px-10">
            <Image
              src={tokenBottom}
              alt=""
              width={180}
              className="self-end opacity-80 transition-opacity hover:opacity-100"
            />
            <div className="flex flex-col gap-1 pb-10">
              <ol className="list-decimal pl-10 font-medium text-fg/70">
                <li className="py-1">
                  You get <span className="font-bold text-fg/80">USDC 100% back</span> after the
                  lock period.
                </li>
                <li className="py-1">
                  It&apos;s <span className="font-bold text-fg/80">first-come-first-served</span>,
                  so don&apos;t miss your chance!
                </li>
                <li className="py-1">
                  This pool distributes{" "}
                  <span className="font-bold text-fg/80">~13% of the 6-months LDY supply</span>.
                </li>
              </ol>

              <Link
                href="https://docs.ledgity.finance/opportunities/arbitrum-lockdrop"
                target="_blank"
                className="pl-6 font-semibold text-fg/90 underline decoration-fg/20 underline-offset-2 transition-colors hover:text-slate-900"
              >
                Learn more <i className="ri-arrow-right-line" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-10 p-10 pt-0">
          <div className="flex flex-col justify-end gap-3">
            <div className="flex items-end gap-5">
              <p className="pb-3 text-lg font-bold">Lock duration</p>
              <RadioGroup
                defaultValue="3"
                onValueChange={(value) => setLockDuration(Number.parseInt(value))}
                className="flex items-center justify-center gap-5"
              >
                <RadioGroupItem
                  value="3"
                  id="3m"
                  className="[data-state='unchecked']]:text-red-500 flex aspect-square h-12 w-12 items-center justify-center text-[#0472B9]"
                >
                  <label htmlFor="3m" className="pointer-events-none relative">
                    <span className="absolute -top-10 rounded-lg bg-[#CD7F32] px-1.5 py-1 font-heading text-sm font-semibold leading-none text-bg">
                      x3
                    </span>
                    3M
                  </label>
                </RadioGroupItem>
                <RadioGroupItem
                  value="6"
                  id="6m"
                  className="[data-state='unchecked']]:text-red-500 flex aspect-square h-12 w-12 items-center justify-center text-[#0472B9]"
                >
                  <label htmlFor="6m" className="pointer-events-none relative">
                    <span className="absolute -top-10 rounded-lg bg-[#8c8c8c] px-1.5 py-1 font-heading text-sm font-semibold leading-none text-bg">
                      x6
                    </span>
                    6M
                  </label>
                </RadioGroupItem>
                <RadioGroupItem
                  value="12"
                  id="12m"
                  className="[data-state='unchecked']]:text-red-500 flex aspect-square h-12 w-12 items-center justify-center text-[#0472B9]"
                >
                  <label htmlFor="12" className="pointer-events-none relative">
                    <span className="absolute -top-10 rounded-lg bg-[#DAA520] px-1.5 py-1 font-heading text-sm font-semibold leading-none text-bg">
                      x12
                    </span>
                    1Y
                  </label>
                </RadioGroupItem>
              </RadioGroup>
            </div>
            <div className="mt-6 flex flex-nowrap items-end justify-center gap-4">
              <AmountInput
                ref={inputEl}
                maxValue={underlyingBalance}
                decimals={6}
                symbol="USDC"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  setDepositedAmount(parseUnits(e.target.value, 6));
                  if (hasUserInteracted === false) setHasUserInteracted(true);
                  if (e.target.value === "") setHasUserInteracted(false);
                }}
                className="w-56"
              />
              <AllowanceTxButton
                size="medium"
                preparation={preparation}
                token={underlyingAddress!}
                spender={lTokenAddress!}
                amount={depositedAmount}
                disabled={depositedAmount === 0n}
                hasUserInteracted={hasUserInteracted}
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
          <div className=" flex max-w-fit flex-col items-center justify-center gap-5 rounded-2xl border border-[#28a0f0]/20 bg-[#28a0f0]/10 p-5 px-16">
            <div>
              <p className="text-center font-medium text-fg/40">You&apos;ll receive</p>
              <Amount
                value={123456781565461650009n}
                decimals={18}
                suffix="LDY"
                className="text-center text-3xl font-bold text-[#0472B9]"
              />
            </div>
            <hr className="w-24 border-2 border-fg/10" />
            <div>
              <p className="text-center text-2xl font-bold text-[#0472B9]/60">0.004%</p>
              <p className="text-center font-medium text-fg/40">Of total allocation</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
