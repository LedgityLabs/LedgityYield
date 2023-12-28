import { AllowanceTxButton, Amount, AmountInput, Card, Input, TxButton } from "@/components/ui";
import { useGenericErc20BalanceOf, useGenericErc20Symbol, useLTokenDecimals, useLTokenUnderlying, usePrepareLTokenRepatriate } from "@/generated";
import { ChangeEvent, FC, useState } from "react";
import { AdminBrick } from "../AdminBrick";
import { useContractAddress } from "@/hooks/useContractAddress";
import { parseUnits, zeroAddress } from "viem";
import { useWalletClient } from "wagmi";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenRepatriate: FC<Props> = ({ lTokenSymbol }) => {
  const { data: walletClient } = useWalletClient();
  const lTokenAddress = useContractAddress(lTokenSymbol);
  const { data: lTokenDecimals } = useLTokenDecimals({
    address: lTokenAddress,
  });
  const { data: underlyingAddress } = useLTokenUnderlying({ address: lTokenAddress! });
  const { data: underlyingBalance } = useGenericErc20BalanceOf({
    address: underlyingAddress,
    args: [walletClient?.account.address || zeroAddress],
    watch: true,
  });
  const { data: underlyingSymbol } = useGenericErc20Symbol({
    address: underlyingAddress,
  });
  const [repatriatedAmount, setRepatriatedAmount] = useState(0n);
  const preparation = usePrepareLTokenRepatriate({
    address: lTokenAddress,
    args: [repatriatedAmount],
  });
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  return (
    <AdminBrick title="Repatriate funds">
      <p>
        This utility can only be called by the fund wallet and will safely transfer a given amount
        of {lTokenSymbol.slice(1)} from fund to {lTokenSymbol} contract.
      </p>
      <div className="flex justify-center items-end gap-3">
        <AmountInput
          maxValue={underlyingBalance}
          decimals={lTokenDecimals}
          symbol={underlyingSymbol}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setRepatriatedAmount(parseUnits(e.target.value, lTokenDecimals!));
            if (hasUserInteracted === false) setHasUserInteracted(true);
            if (e.target.value === "") setHasUserInteracted(false);
          }}
        />
        <AllowanceTxButton
              size="medium"
              preparation={preparation}
              token={underlyingAddress!}
              spender={lTokenAddress!}
              amount={repatriatedAmount}
              disabled={repatriatedAmount === 0n}
              hasUserInteracted={hasUserInteracted}
              transactionSummary={
                <span>
                  Repatriate{" "}
                  <Amount
                    value={repatriatedAmount}
                    decimals={lTokenDecimals}
                    suffix={underlyingSymbol}
                    displaySymbol={true}
                    className="text-indigo-300 underline underline-offset-4 decoration-indigo-300 decoration-2 whitespace-nowrap"
                  />
                </span>
              }
            >
              Repatriate
        </AllowanceTxButton>
      </div>
    </AdminBrick>
  );
};
