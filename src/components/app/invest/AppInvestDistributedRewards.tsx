import { Amount, Card, Spinner } from "@/components/ui";
import { FC, useEffect, useState } from "react";
import { LToken, execute } from "../../../../.graphclient";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { ContractId, LTokenId } from "../../../../contracts/deployments";
import { parseUnits } from "viem";

export const AppInvestDistributedRewards: FC = () => {
  const [totalMintedRewardsUsd, setTotalMintedRewardsUsd] = useState(0n);
  const [isLoading, setIsLoading] = useState(false);

  const computeTotalMintedRewardsUsd = async () => {
    setIsLoading(true);
    return execute(
      `
      {
        ltokens {
          totalMintedRewards
          symbol
          decimals
        }
      }
    `,
    ).then(
      async (result: {
        data: {
          ltokens: LToken[];
        };
      }) => {
        let newTotalMintedRewardsUsd = 0n;
        const proms: Promise<string>[] = [];
        for (const lToken of result.data.ltokens) {
          proms.push(
            getTokenUSDRate(lToken.symbol.slice(1) as ContractId).then((rate) => rate.toString()),
          );
        }
        Promise.all(proms).then((usdRates) => {
          for (let i = 0; i < usdRates.length; i++) {
            const usdRate = usdRates[i];
            const lToken = result.data.ltokens[i];

            newTotalMintedRewardsUsd +=
              (BigInt(lToken.totalMintedRewards) * parseUnits(usdRate, lToken.decimals)) /
              parseUnits("1", lToken.decimals);
          }
          setTotalMintedRewardsUsd(newTotalMintedRewardsUsd);
          setIsLoading(false);
        });
      },
    );
  };
  useEffect(() => {
    computeTotalMintedRewardsUsd();
  }, []);

  return (
    <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
      <h2 className="text-center text-lg font-medium text-indigo-900/80">Distributed rewards</h2>
      <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
        {(isLoading && <Spinner />) || <Amount prefix="$" value={totalMintedRewardsUsd} decimals={6} />}
      </div>
    </Card>
  );
};
