import { Amount, Card, Spinner } from "@/components/ui";
import { FC, useEffect, useState } from "react";
import { LToken, execute } from "../../../../.graphclient";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { parseUnits } from "viem";

export const AppInvestDistributedRewards: FC = () => {
  const [totalMintedRewardsUsd, setTotalMintedRewardsUsd] = useState<bigint | "N/A">(0n);
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
    )
      .then(
        async (result: {
          data: {
            ltokens: LToken[];
          };
        }) => {
          let newTotalMintedRewardsUsd = 0n;
          const proms: Promise<string>[] = [];
          for (const lToken of result.data.ltokens) {
            proms.push(getTokenUSDRate(lToken.symbol.slice(1)).then((rate) => rate.toString()));
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
      )
      .catch((e: Error) => {
        setTotalMintedRewardsUsd("N/A");
        setIsLoading(false);
      });
  };
  useEffect(() => {
    computeTotalMintedRewardsUsd();
  }, []);

  return (
    <Card circleIntensity={0.07} className="h-52 flex-col items-center justify-center px-10 py-4">
      <h2 className="whitespace-nowrap text-center font-heading text-xl font-bold text-indigo-300 grayscale-[50%]">
        Distributed rewards
      </h2>
      <div className="-mt-5 flex h-full items-center justify-center font-heading text-5xl font-bold text-fg/[85%]">
        {(isLoading && <Spinner />) ||
          (typeof totalMintedRewardsUsd === "number" ? (
            <Amount prefix="$" value={totalMintedRewardsUsd} decimals={6} />
          ) : (
            "N/A"
          ))}
      </div>
    </Card>
  );
};
