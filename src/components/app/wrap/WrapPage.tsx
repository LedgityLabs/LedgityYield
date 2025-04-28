// Components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui";
import { TokenLogo } from "@/components/icons/TokenLogo";
import { WrapLTokenTx, UnwrapLTokenTx } from "@/components/contracts";
// Hooks
import { useEffect, useState } from "react";
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
// Function
import { parseUnits, formatUnits } from "viem";

const RAY = 1000000000000000000000000000n;

export function WrapPage() {
  const { appChainId } = useWeb3Context();
  const { lTokenInfosCurrentChain, wLTokenInfosCurrentChain } =
    useAppDataContext();

  const [lTokenSymbol, setLTokenSymbol] = useState(
    lTokenInfosCurrentChain[0]?.symbol,
  );
  const [toWrapped, setToWrapped] = useState<boolean>(true);
  const [depositedAmountText, setDepositedAmountText] = useState("");
  const [receivedAmountText, setReceivedAmountText] = useState("");
  const [depositedAmount, setDepositedAmount] = useState(0n);

  const lTokenData = lTokenInfosCurrentChain.find(
    (token) => token.symbol === lTokenSymbol,
  );

  const wLTokenData = wLTokenInfosCurrentChain.find(
    (token) => token.lToken.toLowerCase() === lTokenData?.address.toLowerCase(),
  );

  const [tokenFrom, tokenTo] = toWrapped
    ? [lTokenData, wLTokenData]
    : [wLTokenData, lTokenData];

  const exchangeRate = toWrapped
    ? (RAY * RAY) / (wLTokenData?.exchangeRate || RAY)
    : wLTokenData?.exchangeRate || RAY;

  function handleSetAmount(amount: string, isFrom: boolean) {
    if (!amount.match(/^[0-9.]+$/) || !tokenFrom || !tokenTo) return;

    const decimals = isFrom ? tokenFrom?.decimals : tokenTo?.decimals;
    const parsedAmount = parseUnits(amount, decimals);

    if (isFrom) {
      setDepositedAmount(parsedAmount);
      setDepositedAmountText(amount);

      const parsedReceived = (parsedAmount * exchangeRate) / RAY;
      setReceivedAmountText(formatUnits(parsedReceived, decimals));
    } else {
      setReceivedAmountText(amount);

      const parsedDeposit = (parsedAmount * RAY) / exchangeRate;
      setDepositedAmount(parsedDeposit);
      setDepositedAmountText(formatUnits(parsedDeposit, decimals));
    }
  }

  function handleSetMax() {
    if (!tokenFrom) return;
    handleSetAmount(formatUnits(tokenFrom?.balance, tokenFrom?.decimals), true);
  }

  useEffect(() => {
    if (!lTokenInfosCurrentChain.length) return;
    setLTokenSymbol(lTokenInfosCurrentChain[0].symbol);
  }, [appChainId, lTokenInfosCurrentChain.length]);

  useEffect(() => {
    if (!tokenFrom || !tokenTo) return;
    handleSetAmount(formatUnits(depositedAmount, tokenFrom?.decimals), true);
  }, [toWrapped]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full text-slate-700 gap-y-4 mb-16">
      <span className="text-2xl lg:text-5xl font-extrabold text-nowrap leading-loose">
        Wrap & Unwrap L-Tokens
      </span>

      <div className="text-sm">Select an L-Token:</div>

      <Select
        disabled={!lTokenInfosCurrentChain.length}
        onValueChange={(value: string) => setLTokenSymbol(value)}
        value={lTokenSymbol}
      >
        <SelectTrigger>
          <SelectValue placeholder="No L-Tokens available" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {lTokenInfosCurrentChain.map((token, i) => (
            <SelectItem key={i} value={token.symbol}>
              <div className="flex justify-center items-center gap-[0.6rem] w-full">
                <TokenLogo symbol={token.symbol} size={28} />
                <p className="font-semibold">{token.symbol}</p>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2 items-stretch bg-fg/[7%] text-fg/80 rounded-2xl p-4 w-[365px] lg:w-[500px] text-sm">
        <div className="flex justify-center items-center pr-4 border-r border-r-fg/20">
          <i className="ri-information-line text-2xl" />
        </div>

        <div className="pl-4 text-left">
          <span className="font-bold">
            Convert {lTokenData?.symbol} (rebasing) to {wLTokenData?.symbol}.
          </span>{" "}
          <br />
          <span>
            Both tokens accrue the same yield — the only difference is how
            rewards are reflected:
          </span>
          <ul>
            <li>
              • {lTokenData?.symbol}: your token balance increases over time
            </li>
            <li>
              • {wLTokenData?.symbol}: your token value increases over time
              (balance stays fixed)
            </li>
          </ul>
          <span>
            This conversion is flexible and instant, allowing you to choose the
            most suitable format for wallets, integrations, or DeFi protocols —
            and switch back at any time.
          </span>
        </div>
      </div>

      {!lTokenData || !wLTokenData || !tokenFrom || !tokenTo ? (
        <div className="flex flex-col w-full p-4 gap-y-2 h-full">
          <p>No L-Tokens on the current chain.</p>
        </div>
      ) : (
        <div>
          <div className="relative rounded-xl bg-accent/10 border-2 border-border flex flex-col gap-2 p-5 w-[365px] lg:w-[500px]">
            <div className="flex flex-col gap-5">
              <div className="relative flex flex-col gap-12">
                {/* From section */}
                <div className="flex w-full flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-12">
                    <label
                      className="whitespace-nowrap text-xs"
                      htmlFor="collateral-amount-wrap-from"
                    >
                      From
                    </label>
                    <button
                      onClick={handleSetMax}
                      className="flex min-w-0 items-center gap-1 text-xs"
                    >
                      <div className="flex items-center gap-1 overflow-hidden text-gray-light">
                        Balance:
                        <span className="overflow-hidden text-ellipsis">
                          {formatUnits(tokenFrom.balance, tokenFrom.decimals)}
                        </span>
                      </div>
                      <div className="text-buy disabled:opacity-30">MAX</div>
                    </button>
                  </div>
                  <div className="w-full border-2 border-border rounded-xl p-3 flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <TokenLogo
                        symbol={tokenFrom.symbol}
                        size={35}
                        className="p-1"
                      />
                      <span className="text-xs font-medium">
                        {tokenFrom.symbol}
                      </span>
                    </div>

                    <div className="relative w-full">
                      <input
                        className="w-full bg-transparent text-right !focus-visible:box-shadow-none"
                        placeholder="0.00"
                        type="text"
                        inputMode="numeric"
                        value={depositedAmountText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleSetAmount(e.target.value, true)
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* Switch button */}
                <div className="absolute left-1/2 top-[105px]">
                  <div className="relative h-10">
                    <button
                      type="button"
                      onClick={() => setToWrapped(!toWrapped)}
                      className="absolute z-10 flex items-center justify-center top-1/2 -translate-x-1/2 p-1 -translate-y-1/2 rounded-full ring-2 ring-border text-fg/80 transition-all duration-300 hover:ring-primary hover:text-primary left-[50%] hover:scale-110"
                    >
                      <i className="h-6 w-6 ri-arrow-up-down-line" />
                    </button>
                  </div>
                </div>

                {/* To section */}
                <div className="flex w-full flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-12">
                    <label
                      className="whitespace-nowrap text-xs"
                      htmlFor="collateral-amount-wrap-to"
                    >
                      To
                    </label>
                  </div>
                  <div className="w-full border-2 border-border rounded-xl p-3 flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <TokenLogo
                        symbol={tokenTo.symbol}
                        size={35}
                        className="p-1"
                      />
                      <span className="text-xs font-medium">
                        {tokenTo.symbol}
                      </span>
                    </div>

                    <div className="relative w-full">
                      <input
                        className="w-full bg-transparent text-right !focus-visible:box-shadow-none"
                        placeholder="0.00"
                        type="text"
                        inputMode="numeric"
                        value={receivedAmountText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleSetAmount(e.target.value, false)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action button */}
              <div className="flex w-full">
                {toWrapped ? (
                  <WrapLTokenTx
                    className="w-full"
                    buttonText={`Wrap`}
                    disabled={!depositedAmount}
                    contractAddress={wLTokenData.address}
                    params={{
                      amount: formatUnits(depositedAmount, lTokenData.decimals),
                      tokenDecimals: lTokenData.decimals,
                      symbol: lTokenData.symbol,
                    }}
                    approveChecks={[
                      {
                        symbol: lTokenData.symbol,
                        token: lTokenData.address,
                        tokenDecimals: lTokenData.decimals,
                        spender: wLTokenData.address,
                        amount: formatUnits(
                          depositedAmount,
                          lTokenData.decimals,
                        ),
                      },
                    ]}
                  />
                ) : (
                  <UnwrapLTokenTx
                    className="w-full"
                    buttonText={`Unwrap`}
                    disabled={!depositedAmount}
                    contractAddress={wLTokenData.address}
                    params={{
                      amount: formatUnits(depositedAmount, lTokenData.decimals),
                      tokenDecimals: lTokenData.decimals,
                      symbol: wLTokenData.symbol,
                    }}
                  />
                )}
              </div>

              <div className="text-xs">
                1 {tokenFrom.symbol} ={" "}
                {Number(formatUnits(exchangeRate, 27)).toFixed(5)}{" "}
                {tokenTo.symbol}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
