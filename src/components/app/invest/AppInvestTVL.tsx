import { Amount, Card, Spinner } from "@/components/ui";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { FC, useEffect, useState } from "react";
import { getContractAddress } from "@/lib/getContractAddress";
import { usePublicClient } from "wagmi";
import { watchReadContracts } from "@wagmi/core";
import { lTokenABI } from "@/generated";
import { parseUnits } from "viem";

interface Props {}
export const AppInvestTVL: FC<Props> = ({}) => {
  const publicClient = usePublicClient();
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
    }[];

    // Push read calls for total supply and decimals of each lToken
    for (const lTokenSymbol of lTokens) {
      const lTokenAddress = getContractAddress(lTokenSymbol, publicClient.chain.id);

      // Ensure no address is missing
      if (!lTokenAddress)
        throw "Some contracts addresses are missing for the current chain. Cannot watch data.";

      // Populate required reads requests
      ["totalSupply", "decimals"].forEach((functionName) => {
        newReadsConfig.push({
          address: lTokenAddress,
          abi: lTokenABI,
          functionName: functionName,
        });
      });
    }

    if (JSON.stringify(newReadsConfig) !== JSON.stringify(readsConfig)) {
      setIsLoading(true);
      setReadsConfig(newReadsConfig);
    }
  };

  useEffect(populateReadsConfig, [publicClient.chain.id, readsConfig]);

  useEffect(
    () =>
      watchReadContracts(
        {
          contracts: readsConfig,
          listenToBlock: true,
        },
        async (data) => {
          let newTvlUsd = 0n;
          for (const lTokenSymbol of lTokens) {
            // Extract data
            const lTokenTotalSupply = data.shift()!.result! as bigint;
            const lTokenDecimals = data.shift()!.result! as number;
            const underlyingSymbol = lTokenSymbol.slice(1);

            // Skip, if data is not available
            if (!lTokenTotalSupply || !lTokenDecimals) continue;

            // Retrieve underlying token USD rate
            const usdRate = await getTokenUSDRate(underlyingSymbol).then((rate) => rate.toString());

            newTvlUsd +=
              (lTokenTotalSupply * parseUnits(usdRate, lTokenDecimals)) /
              parseUnits("1", lTokenDecimals);
          }

          if (tvlUsd.toString() !== newTvlUsd.toString()) setTvlUsd(newTvlUsd);
          setIsLoading(false);
        },
      ),
    [readsConfig, tvlUsd],
  );

  return (
    <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
      <h2 className="text-center text-lg font-medium text-indigo-900/80">TVL</h2>
      <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
        {(isLoading && <Spinner />) || <Amount prefix="$" value={tvlUsd} decimals={6} />}
      </div>
    </Card>
  );
};
