import { Card, Rate, Spinner } from "@/components/ui";
import { FC, useEffect, useState } from "react";
import { APRChange, execute } from "graphclient";
import { usePublicClient } from "wagmi";

const secondsInOneYear = 60 * 60 * 24 * 365;

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const AppInvestVariation: FC<Props> = (props) => {
  const publicClient = usePublicClient();
  const [variation, setVariation] = useState<number | "N/A">(0);
  const [isLoading, setIsLoading] = useState(false);

  const computeVariation = async () => {
    const oneYearAgo = Math.floor(Date.now() / 1000) - secondsInOneYear;
    setIsLoading(true);
    return execute(
      `
      {
        c${publicClient!.chain.id}_ltokens {
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
      {},
    )
      .then(
        async (result: {
          data: {
            [key: string]: [
              {
                latestAprUpdate: APRChange[];
                aprUpdateOneYearAgo: APRChange[];
              },
            ];
          };
        }) => {
          const aprUpdateData = result.data[`c${publicClient!.chain.id}_ltokens`];
          let newVariation = 0;
          for (const lToken of aprUpdateData) {
            if (!lToken.latestAprUpdate[0]) continue;
            const latestAprUpdate = Number(lToken.latestAprUpdate[0].apr);
            const aprUpdateOneYearAgo = Number(lToken.aprUpdateOneYearAgo[0].apr);
            if (latestAprUpdate > aprUpdateOneYearAgo)
              newVariation += (latestAprUpdate - aprUpdateOneYearAgo) / latestAprUpdate;
            else if (latestAprUpdate < aprUpdateOneYearAgo)
              newVariation += (aprUpdateOneYearAgo - latestAprUpdate) / aprUpdateOneYearAgo;
          }
          newVariation = newVariation / aprUpdateData.length;

          // Format variation as UD7x3 as required by <Rate /> component
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
  useEffect(() => {
    computeVariation();
  }, [publicClient]);

  return (
    <div {...props}>
      {(isLoading && <Spinner />) ||
        (typeof variation === "number" ? <Rate value={variation} prefix={"±"} /> : "N/A")}
    </div>
  );
};
