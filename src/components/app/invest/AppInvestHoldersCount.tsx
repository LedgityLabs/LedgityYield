import { Amount, Card, Spinner } from "@/components/ui";
import { FC, useEffect, useState } from "react";
// import { LToken, execute } from "graphclient";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { parseUnits } from "viem";

const availableChains = ["42161", "59144"];

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const AppInvestHoldersCount: FC<Props> = (props) => {
  // const [totalMintedRewardsUsd, setTotalMintedRewardsUsd] = useState<bigint | "N/A">(0n);
  // const [isLoading, setIsLoading] = useState(false);

  // const computeTotalMintedRewardsUsd = async () => {
  //   setIsLoading(true);

  //   // Build GraphQL query string
  //   let queryString = "{\n";
  //   for (const chainId of availableChains) {
  //     queryString += `
  //       c${chainId}_ltokens {
  //         totalMintedRewards
  //         symbol
  //         decimals
  //       }`;
  //   }
  //   queryString += "\n}";

  //   return execute(queryString, {})
  //     .then(
  //       async (result: {
  //         data: {
  //           [key: string]: LToken[];
  //         };
  //       }) => {
  //         let newTotalMintedRewardsUsd = 0n;
  //         const proms: Promise<void>[] = [];

  //         for (const chainId of availableChains) {
  //           const rewardsMintsData = result.data[`c${chainId}_ltokens`];
  //           for (const lToken of rewardsMintsData) {
  //             proms.push(
  //               getTokenUSDRate(lToken.symbol.slice(1)).then((usdRate) => {
  //                 newTotalMintedRewardsUsd +=
  //                   (BigInt(lToken.totalMintedRewards) *
  //                     parseUnits(usdRate.toString(), lToken.decimals)) /
  //                   parseUnits("1", lToken.decimals);
  //               }),
  //             );
  //           }
  //         }

  //         await Promise.all(proms).then(() => {
  //           setTotalMintedRewardsUsd(newTotalMintedRewardsUsd);
  //           setIsLoading(false);
  //         });
  //       },
  //     )
  //     .catch((e: Error) => {
  //       setTotalMintedRewardsUsd("N/A");
  //       setIsLoading(false);
  //     });
  // };
  // useEffect(() => {
  //   computeTotalMintedRewardsUsd();
  // }, []);

  return (
    <div {...props}>
      {/* {(isLoading && <Spinner />) ||
        (totalMintedRewardsUsd !== "N/A" ? (
          <Amount prefix="$" value={totalMintedRewardsUsd} decimals={6} />
        ) : (
          "N/A"
        ))} */}
      653
    </div>
  );
};
