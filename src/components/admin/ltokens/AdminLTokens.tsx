import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  TokenLogo,
} from "@/components/ui";
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
  const { lTokenInfosCurrentChain } = useAppDataContext();
  const [lTokenSymbol, setLTokenSymbol] = useState(
    lTokenInfosCurrentChain[0]?.symbol,
  );

  useEffect(() => {
    if (lTokenInfosCurrentChain.length) {
      setLTokenSymbol(lTokenInfosCurrentChain[0].symbol);
    }
  }, [lTokenInfosCurrentChain]);

  const lTokenAddress = lTokenInfosCurrentChain.find(
    (token) => token.symbol === lTokenSymbol,
  )?.address;

  return (
    <section className="flex flex-col gap-6 justify-center items-center">
      {lTokenInfosCurrentChain.length ? (
        <>
          <Select
            onValueChange={(value: string) => setLTokenSymbol(value)}
            value={lTokenSymbol}
          >
            <SelectTrigger>
              <SelectValue placeholder="No L-Tokens available" />
            </SelectTrigger>
            <SelectContent>
              {lTokenInfosCurrentChain.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  <div className="flex justify-center items-center gap-[0.6rem]">
                    <TokenLogo symbol={token.symbol} size={28} />
                    <p className="font-semibold">{token.symbol}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <AdminMasonry>
            <AdminLTokenWithdrawalRequests lTokenSymbol={lTokenSymbol} />
            <AdminLTokenAddresses lTokenAddress={lTokenAddress} />
            <AdminLTokenAPR lTokenSymbol={lTokenSymbol} />
            <AdminLTokenRepatriate lTokenSymbol={lTokenSymbol} />
            <AdminLTokenRetentionRate lTokenSymbol={lTokenSymbol} />
            <AdminLTokenFeesRate lTokenSymbol={lTokenSymbol} />
            <AdminLTokenClaimFees lTokenSymbol={lTokenSymbol} />
            <AdminLTokenSignal lTokenSymbol={lTokenSymbol} />
          </AdminMasonry>
        </>
      ) : (
        <p>No L-Tokens available</p>
      )}
    </section>
  );
}
