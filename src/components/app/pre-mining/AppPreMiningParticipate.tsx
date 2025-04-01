"use client";

// Components
import { Amount } from "@/components/ui";
import { Progress } from "@/components/ui/Progress";
import { InstantUnlockTx, RequestUnlockTx } from "@/components/contracts";
// Hooks
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  useCanInstantWithdraw,
  useLTokenWithdrawalFeeInEth,
  usePreminingAccountsLocks,
} from "@/hooks/contracts";
// Functions
import { formatUnits, parseUnits } from "viem";
import { useGetContractAddress } from "@/hooks/useGetContractAddress";

export function AppPreMiningParticipate({ className }: { className?: string }) {
  const { currentAccount } = useWeb3Context();
  const lTokenAddress = useGetContractAddress(`LUSDC`);

  const withdrawalFeeInEth = useLTokenWithdrawalFeeInEth(lTokenAddress);
  const { lockAmount, lockDuration, lockStart, lockEnd, lockUnlocked } =
    usePreminingAccountsLocks(currentAccount);
  const canInstantWithdraw = useCanInstantWithdraw(
    lTokenAddress,
    currentAccount,
    lockAmount,
  );

  const hasLocked = lockAmount > 0n;

  const lockProgression =
    (Date.now() - lockStart.getTime()) /
    (lockEnd.getTime() - lockStart.getTime());

  // Compute account's eligible LDY amount
  const maxWeight = parseUnits((4_000_000 * 12).toString(), 6);
  const accountWeight = lockAmount * BigInt(lockDuration);
  const eligibleLDY = (parseUnits("1125000", 18) * accountWeight) / maxWeight;
  // Compute account's eligible airdrop entries
  const eligibleEntries =
    Number(formatUnits(lockAmount, 6)) *
    ({ 3: 1, 6: 5, 12: 25 }[lockDuration] || 0);

  return (
    <div className={`flex flex-col ${className}`}>
      {hasLocked ? (
        <div className="bg-green-500 text-slate-50 p-5 text-center text-lg font-semibold">
          <i className="ri-checkbox-circle-line text-xl" />
          &nbsp; You participated
        </div>
      ) : (
        <div className="bg-red-500 text-slate-50 p-5 text-center text-lg font-semibold">
          <i className="ri-close-circle-line text-xl" />
          &nbsp; You didn&apos;t participated
        </div>
      )}

      {hasLocked && (
        <div className="bg-indigo-950/10 p-2">
          <div className="flex flex-col items-center gap-16 p-10 bg-accent rounded-b-3xl">
            <div className="flex flex-col gap-1 w-full">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-3xl font-heading text-indigo-950/[75%]">
                  Your lock
                </h3>
                <ul className="list-disc pl-6 leading-7">
                  <li>
                    Amount:{" "}
                    <Amount
                      value={lockAmount}
                      decimals={6}
                      suffix="USDC"
                      displaySymbol={true}
                      className="font-bold"
                    />
                  </li>
                  <li>
                    Duration:{" "}
                    <span className="font-bold">{lockDuration} months</span>
                  </li>
                  <li>
                    Start:{" "}
                    <span className="font-bold">
                      {lockStart.toLocaleDateString()}
                    </span>
                  </li>
                  <li>
                    End:{" "}
                    <span className="font-bold">
                      {lockEnd.toLocaleDateString()}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex items-center justify-center gap-5 w-full">
                <Progress value={lockProgression * 100} />
                {canInstantWithdraw ? (
                  <InstantUnlockTx
                    disabled={!hasLocked || lockUnlocked}
                    buttonText="Unlock now"
                  />
                ) : (
                  <RequestUnlockTx
                    disabled={!hasLocked || lockUnlocked}
                    params={{
                      msgValue: withdrawalFeeInEth,
                    }}
                    buttonText="Request Unlock"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col  gap-10 w-full">
              <div className="flex flex-col gap-2">
                <h3 className="font-bold text-3xl font-heading text-indigo-950/[75%]">
                  Your rewards
                </h3>
                <ul className="list-disc pl-6 leading-7">
                  <li>
                    Tokens:{" "}
                    <Amount
                      value={eligibleLDY}
                      decimals={18}
                      suffix="LDY"
                      displaySymbol={true}
                      className="font-bold"
                    />
                  </li>
                  <li>
                    Airdrop entries:{" "}
                    <span className="font-bold">
                      {eligibleEntries.toLocaleString()}{" "}
                      <i className="ri-coupon-2-fill" />
                    </span>
                  </li>
                </ul>
              </div>
              <div className="bg-slate-300 text-lg font-medium p-4 rounded-xl text-center">
                $LDY rewards will be distributed simultaneously with the
                airdrop.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
