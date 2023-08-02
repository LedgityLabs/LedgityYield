import { Card, Rate, Spinner } from "@/components/ui";
import { FC, useEffect, useState } from "react";
import { APRUpdate, execute } from "../../../../.graphclient";

const secondsInOneYear = 60 * 60 * 24 * 365;

export const AppInvestVariation: FC = () => {
  const [variation, setVariation] = useState<number | "N/A">(0);
  const [isLoading, setIsLoading] = useState(false);

  const computeVariation = async () => {
    const oneYearAgo = Math.floor(Date.now() / 1000) - secondsInOneYear;
    setIsLoading(true);
    return execute(
      `
      {
        ltokens {
          latestAprUpdate: aprUpdates(orderBy: timestamp, orderDirection: desc, first: 1) {
            apr
            timestamp
          }
          aprUpdateOneYearAgo: aprUpdates(where: {timestamp_gte: ${oneYearAgo}}, orderBy: timestamp, orderDirection: asc, first: 1) {
            apr
            timestamp
          }
        }
      }
    `,
    )
      .then(
        async (result: {
          data: {
            ltokens: [
              {
                latestAprUpdate: APRUpdate[];
                aprUpdateOneYearAgo: APRUpdate[];
              },
            ];
          };
        }) => {
          let newVariation = 0;
          for (const lToken of result.data.ltokens) {
            if (!lToken.latestAprUpdate[0]) continue;
            const latestAprUpdate = Number(lToken.latestAprUpdate[0].apr);
            const aprUpdateOneYearAgo = Number(lToken.aprUpdateOneYearAgo[0].apr);
            if (latestAprUpdate > aprUpdateOneYearAgo)
              newVariation += (latestAprUpdate - aprUpdateOneYearAgo) / latestAprUpdate;
            else if (latestAprUpdate < aprUpdateOneYearAgo)
              newVariation += (aprUpdateOneYearAgo - latestAprUpdate) / aprUpdateOneYearAgo;
          }
          newVariation = newVariation / result.data.ltokens.length;
          // Format variation as UD3 as required by <Rate /> component
          newVariation = Math.round(newVariation * 100 * 1000);
          setVariation(newVariation);
          setIsLoading(false);
        },
      )
      .catch((e: Error) => {
        setVariation("N/A");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    computeVariation();
  }, []);
  return (
    <Card circleIntensity={0.07} className="h-52 flex-col justify-center items-center py-4 px-10">
      <h2 className="text-center text-lg font-medium text-indigo-900/80">1 year variation</h2>
      <div className="h-full -mt-5 flex justify-center items-center text-5xl font-heavy font-heading">
        {(isLoading && <Spinner />) ||
          (typeof variation === "number" ? <Rate value={variation} prefix={"±"} /> : "N/A")}
      </div>
    </Card>
  );
};
