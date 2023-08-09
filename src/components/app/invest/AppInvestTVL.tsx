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
  const [rawData, setRawData] = useState<[string, bigint, number][]>([]);
  const [tvlUsd, setTvlUsd] = useState(0n);
  const lTokens = useAvailableLTokens();
  const [isLoading, setIsLoading] = useState(false);

  // This function retrieve symbol, total supply and decimals of each lToken
  const watchRawData = () => {
    const contractsConfig = [] as {
      address: `0x${string}`;
      abi: any;
      functionName: string;
    }[];

    // Push read calls for total supply and decimals of each lToken
    for (const lTokenSymbol of lTokens) {
      const lTokenAddress = getContractAddress(lTokenSymbol, publicClient.chain.id);
      contractsConfig.push({
        address: lTokenAddress!,
        abi: lTokenABI,
        functionName: "totalSupply",
      });
      contractsConfig.push({
        address: lTokenAddress!,
        abi: lTokenABI,
        functionName: "decimals",
      });
    }

    // Watch on those read calls
    return watchReadContracts(
      {
        contracts: contractsConfig,
        listenToBlock: true,
      },
      (res) => {
        const newRawData: [string, bigint, number][] = [];
        for (const lTokenSymbol of lTokens) {
          const lTokenTotalSupply = res.shift()?.result as bigint;
          const lTokenDecimals = res.shift()?.result as number;
          if (!lTokenTotalSupply || !lTokenDecimals) continue;
          newRawData.push([lTokenSymbol, lTokenTotalSupply, lTokenDecimals]);
        }
        setRawData(newRawData);
      },
    );
  };

  // This function compute the TVL in USD from the raw L-Tokens data
  const computeTvlUsd = async () => {
    setIsLoading(true);
    let newTvlUsd = 0n;
    for (const lTokenData of rawData) {
      const usdRate = await getTokenUSDRate(lTokenData[0].slice(1)).then((rate) => rate.toString());
      newTvlUsd +=
        (lTokenData[1] * parseUnits(usdRate, lTokenData[2])) / parseUnits("1", lTokenData[2]);
    }
    setTvlUsd(newTvlUsd);
    setIsLoading(false);
  };

  useEffect(watchRawData, []);

  useEffect(() => {
    computeTvlUsd();
  }, [publicClient, rawData]);

  return (
    <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
      <h2 className="text-center text-lg font-medium text-indigo-900/80">TVL</h2>
      <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
        {(isLoading && <Spinner />) || <Amount prefix="$" value={tvlUsd} decimals={6} />}
      </div>
    </Card>
  );
};
