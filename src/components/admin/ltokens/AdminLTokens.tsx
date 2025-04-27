import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { TokenLogo } from "@/components/icons/TokenLogo";
import { useState, useEffect } from "react";
// Context
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
// Components
import { AdminLTokenAPR } from "./AdminLTokenAPR";
import { AdminLTokenRetentionRate } from "./AdminLTokenRetentionRate";
import { AdminMasonry } from "../AdminMasonry";
import { AdminLTokenClaimFees } from "./AdminLTokenClaimFees";
import { AdminLTokenRepatriate } from "./AdminLTokenRepatriate";
import { AdminLTokenAddresses } from "./AdminLTokenAddresses";
import { AdminLTokenSignal } from "./AdminLTokenSignal";
import { AdminLTokenWithdrawalRequests } from "./AdminLTokenWithdrawalRequests";
import { AdminLTokenFeesRate } from "./AdminLTokenFeesRate";

export function AdminLTokens() {
  const { lTokenInfosCurrentChain, tokenInfos } = useAppDataContext();
  const [lTokenSymbol, setLTokenSymbol] = useState(
    lTokenInfosCurrentChain[0]?.symbol,
  );

  useEffect(() => {
    if (lTokenInfosCurrentChain.length) {
      setLTokenSymbol(lTokenInfosCurrentChain[0].symbol);
    }
  }, [lTokenInfosCurrentChain]);

  const lTokenData = lTokenInfosCurrentChain.find(
    (token) => token.symbol === lTokenSymbol,
  );
  const underlyingTokenData = tokenInfos.find(
    (token) => token.address === lTokenData?.underlying,
  );

  return (
    <section className="flex flex-col gap-6 justify-center items-center">
      <Select
        onValueChange={(value: string) => setLTokenSymbol(value)}
        value={lTokenSymbol}
      >
        <SelectTrigger>
          <SelectValue placeholder="No L-Tokens available" />
        </SelectTrigger>
        <SelectContent>
          {lTokenInfosCurrentChain.map((token, i) => (
            <SelectItem key={i} value={token.symbol}>
              <div className="flex justify-center items-center gap-[0.6rem]">
                <TokenLogo symbol={token.symbol} size={28} />
                <p className="font-semibold">{token.symbol}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {!lTokenData || !underlyingTokenData ? (
        <p>No L-Tokens available</p>
      ) : (
        <AdminMasonry>
          <AdminLTokenWithdrawalRequests
            tokenData={lTokenData}
            underlyingTokenData={underlyingTokenData}
          />
          <AdminLTokenAddresses tokenData={lTokenData} />
          <AdminLTokenAPR tokenData={lTokenData} />
          <AdminLTokenRepatriate
            tokenData={lTokenData}
            underlyingTokenData={underlyingTokenData}
          />
          <AdminLTokenRetentionRate
            tokenData={lTokenData}
            underlyingTokenData={underlyingTokenData}
          />
          <AdminLTokenFeesRate
            tokenData={lTokenData}
            underlyingTokenData={underlyingTokenData}
          />
          <AdminLTokenClaimFees tokenData={lTokenData} />
          <AdminLTokenSignal tokenData={lTokenData} />
        </AdminMasonry>
      )}
    </section>
  );
}
