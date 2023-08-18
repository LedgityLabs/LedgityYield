import { Amount, Card, Spinner } from "@/components/ui";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { FC, useEffect, useState } from "react";
import { getContractAddress } from "@/lib/getContractAddress";
import { watchReadContracts } from "@wagmi/core";
import { lTokenABI } from "@/generated";
import { parseUnits } from "viem";

const availableChains = [42161, 59144];

interface Props {}
export const AppInvestTVL: FC<Props> = ({}) => {
  const [readsConfig, setReadsConfig] = useState<
    Parameters<typeof watchReadContracts>[0]["contracts"]
  >([]);
  const [tvlUsd, setTvlUsd] = useState(0n);
  const lTokens = useAvailableLTokens();
  const [isLoading, setIsLoading] = useState(false);

  // This function retrieve symbol, total supply and decimals of each lToken
  const populateReadsConfig = () => {
    //
    const newReadsConfig = [] as {
      address: `0x${string}`;
      abi: any;
      functionName: string;
      chainId: number;
    }[];

    // Push read calls for total supply and decimals of each lToken
    for (const chainId of availableChains) {
      for (const lTokenSymbol of lTokens) {
        const lTokenAddress = getContractAddress(lTokenSymbol, chainId);
  
        // Ensure no address is missing
        if (!lTokenAddress)
          throw "Some contracts addresses are missing for the current chain. Cannot watch data.";
  
        // Populate required reads requests
        ["symbol", "totalSupply", "decimals"].forEach((functionName) => {
          newReadsConfig.push({
            address: lTokenAddress,
            abi: lTokenABI,
            functionName: functionName,
            chainId: chainId,
          });
        });
    }
    }

    if (JSON.stringify(newReadsConfig) !== JSON.stringify(readsConfig)) {
      setIsLoading(true);
      setReadsConfig(newReadsConfig);
    }
  };

  useEffect(populateReadsConfig, [readsConfig]);

  useEffect(
    () =>
      watchReadContracts(
        {
          contracts: readsConfig,
          listenToBlock: true,
        },
        async (data) => {
          if (data.length > 0) {
            let newTvlUsd = 0n;
            while (data.length !== 0) {
              // Extract data
              const lTokenSymbol = data.shift()!.result! as string;
              const lTokenTotalSupply = data.shift()!.result! as bigint;
              const lTokenDecimals = data.shift()!.result! as number;
              const underlyingSymbol = lTokenSymbol.slice(1);

              // Skip, if data is not available
              if (!lTokenTotalSupply || !lTokenDecimals) continue;

              // Retrieve underlying token USD rate
              const usdRate = await getTokenUSDRate(underlyingSymbol).then((rate) =>
                rate.toString(),
              );

              newTvlUsd +=
                (lTokenTotalSupply * parseUnits(usdRate, lTokenDecimals)) /
                parseUnits("1", lTokenDecimals);
            }

            if (tvlUsd.toString() !== newTvlUsd.toString()) setTvlUsd(newTvlUsd);
          }
          setIsLoading(false);
        },
      ),
    [readsConfig, tvlUsd],
  );

  return (
    <Card circleIntensity={0.07} className="h-52 flex-col items-center justify-center px-10 py-4">
      <h2 className="text-center font-heading text-xl font-bold text-indigo-300 grayscale-[50%]">
        TVL
      </h2>
      <div className="-mt-5 flex h-full items-center justify-center font-heading text-5xl font-bold text-fg/[85%]">
        {(isLoading && <Spinner />) || <Amount prefix="$" value={tvlUsd} decimals={6} />}
      </div>
    </Card>
  );
};
