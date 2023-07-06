import { Amount, Card, Spinner } from "@/components/ui";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { FC, useEffect, useState } from "react";
import { ContractId } from "../../../../hardhat/deployments";
import { getContractAddress } from "@/lib/getContractAddress";
import { usePublicClient } from "wagmi";
import { readLToken } from "@/generated";
import { parseUnits } from "viem";
import { chunkArray } from "@/lib/chunkArray";

interface Props {}
export const AppInvestTVL: FC<Props> = ({}) => {
  const publicClient = usePublicClient();
  const [tvlUsd, setTvlUsd] = useState(0n);
  const lTokens = useAvailableLTokens();
  const [isLoading, setIsLoading] = useState(false);

  const computeTvlUsd = async () => {
    setIsLoading(true);
    let newTvlUsd = 0n;
    const proms: Promise<bigint | number>[] = [];
    for (const lTokenId of lTokens) {
      const lTokenAddress = getContractAddress(lTokenId, publicClient.chain.id);
      proms.push(
        readLToken({
          address: lTokenAddress!,
          functionName: "totalSupply",
        })
      );
      proms.push(
        getTokenUSDRate(lTokenId.slice(1) as ContractId).then((rate) => parseUnits(rate.toString(), 6))
      );
      proms.push(
        readLToken({
          address: lTokenAddress!,
          functionName: "decimals",
        })
      );
    }
    Promise.all(proms).then((results) => {
      const lTokensData = chunkArray(results, 3) as [bigint, bigint, number][];
      for (const lTokenData of lTokensData) {
        newTvlUsd += (lTokenData[0] * lTokenData[1]) / parseUnits("1", lTokenData[2]);
      }
      setTvlUsd(newTvlUsd);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    computeTvlUsd();
  }, []);
  return (
    <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
      <h2 className="text-center text-lg font-medium text-indigo-900/80">TVL</h2>
      <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
        {(isLoading && <Spinner />) || <Amount prefix="$" value={tvlUsd} decimals={6} />}
      </div>
    </Card>
  );
};
