import { Amount, Card } from "@/components/ui";
import { FC, useEffect, useState } from "react";
import { LToken, execute } from "../../../../.graphclient";

export const AppInvestDistributedRewards: FC = () => {
  const distrubutedRewards = 945512123456n;
  const decimals = 6;
  const [totalMintedRewardsUsd, setTotalMintedRewardsUsd] = useState<LToken[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    execute(
      `
      {
        ltokens {
          totalMintedRewards
        }
      }
    `,
      {}
    ).then(
      (result: {
        data: {
          ltokens: LToken[];
        };
      }) => {
        result.data.ltokens;
      }
    );
  }, [setTotalMintedRewardsUsd]);

  return (
    <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
      <h2 className="text-center text-lg font-medium text-indigo-900/80">Distributed rewards</h2>
      <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
        <Amount prefix="$" value={distrubutedRewards} decimals={decimals} />
      </div>
    </Card>
  );
};
