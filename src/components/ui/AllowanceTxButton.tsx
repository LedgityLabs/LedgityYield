import { FC } from "react";
import { usePrepareContractWrite } from "wagmi";
import {
  useGenericErc20Allowance,
  useGenericErc20Decimals,
  useGenericErc20Symbol,
  usePrepareGenericErc20Approve,
} from "@/generated";
import { useDApp } from "@/hooks";
import { formatUnits, zeroAddress } from "viem";
import { TxButton } from "./TxButton";

interface Props extends React.ComponentPropsWithoutRef<typeof TxButton> {
  token: `0x${string}`;
  spender: `0x${string}`;
  amount?: bigint;
  preparation: ReturnType<typeof usePrepareContractWrite>;
  transactionSummary?: string;
}
/**
 * A version of the TxButton that allows to ensure and set (if needed) a given ERC20 allowance before
 * signing the transaction.
 */
export const AllowanceTxButton: FC<Props> = ({
  token,
  spender,
  amount = 0n,
  preparation,
  transactionSummary = "",
  ...props
}) => {
  const { walletClient } = useDApp();
  const { data: symbol } = useGenericErc20Symbol({ address: token });
  const { data: decimals } = useGenericErc20Decimals({ address: token });
  const { data: allowance } = useGenericErc20Allowance({
    address: token,
    args: [walletClient?.account.address || zeroAddress, spender],
  });
  const allowancePreparation = usePrepareGenericErc20Approve({
    address: token,
    args: [spender, amount],
  });

  if (allowance && allowance >= amount) {
    return <TxButton preparation={preparation} transactionSummary={transactionSummary} {...props} />;
  } else {
    return (
      <TxButton
        preparation={allowancePreparation}
        transactionSummary={`Allow Ledgity DeFi to spend ${formatUnits(amount, decimals!)} ${symbol}`}
        {...props}
        disabled={amount === 0n}
      >
        Allow
      </TxButton>
    );
  }
};
