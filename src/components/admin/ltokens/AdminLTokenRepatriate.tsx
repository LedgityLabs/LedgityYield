// Components
import { AdminBrick } from "@/components/admin/AdminBrick";
import { RepatriateTx } from "@/components/contracts";
import { AmountInput } from "@/components/ui";
// Hooks
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useBalanceOf } from "@/hooks/contracts";
import { useState } from "react";
// Types
import { LTokenInfo, TokenInfo } from "@/types";

export function AdminLTokenRepatriate({
  tokenData,
  underlyingTokenData,
}: {
  tokenData: LTokenInfo;
  underlyingTokenData: TokenInfo;
}) {
  const { currentAccount } = useWeb3Context();
  const underlyingBalance = useBalanceOf(tokenData?.underlying, currentAccount);
  const [repatriatedAmount, setRepatriatedAmount] = useState("");

  function handleSetRapatriatedAmount(e: React.ChangeEvent<HTMLInputElement>) {
    if (!tokenData) return;
    setRepatriatedAmount(e.target.value);
  }

  return (
    <AdminBrick title="Repatriate funds">
      <p>
        This utility can only be called by the fund wallet and will safely
        transfer a given amount of {underlyingTokenData?.symbol} from fund to{" "}
        {tokenData.symbol} contract.
      </p>
      <div className="flex justify-center items-end gap-3">
        <AmountInput
          maxValue={underlyingBalance}
          decimals={tokenData.decimals}
          symbol={tokenData.symbol}
          onChange={handleSetRapatriatedAmount}
        />
        <RepatriateTx
          buttonText="Repatriate"
          contractAddress={tokenData.address}
          disabled={!repatriatedAmount}
          params={{
            symbol: tokenData.symbol,
            amount: repatriatedAmount,
            tokenDecimals: tokenData.decimals,
          }}
          approveChecks={[
            {
              symbol: underlyingTokenData.symbol,
              token: tokenData.underlying,
              tokenDecimals: underlyingTokenData.decimals,
              spender: tokenData.address,
              amount: repatriatedAmount,
            },
          ]}
        />
      </div>
    </AdminBrick>
  );
}
