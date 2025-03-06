import { Card, Rate, Spinner } from "@/components/ui";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  GraphTokenEntry,
  useGrowthRevenueData,
} from "@/hooks/subgraph/useGrowthRevenueData";
import React, { useEffect, useState } from "react";

export const AppDashboardGrowth: React.PropsWithoutRef<typeof Card> = ({
  className,
}) => {
  const { currentAccount } = useWeb3Context();
  const [totalGrowth, setTotalGrowth] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { growthData, isDataLoading } = useGrowthRevenueData();

  const computeTotalProfits = () => {
    let cumulatedRevenue = 0;

    const combination: [number, number][] = Object.values(growthData).map(
      (data: GraphTokenEntry[]) => {
        // Compute cumulative revenue for this L-Token
        const lTokenTotalRevenue = data.reduce(
          (acc, value) => acc + value.revenue,
          0,
        );
        cumulatedRevenue += lTokenTotalRevenue;

        //  Compute cumulative growth and average balance before for this L-Token
        const cumulativeGrowth = data.reduce((acc, val) => acc + val.growth, 0);
        const averageBalanceBefore =
          data.reduce((acc, val) => acc + val.balanceBefore, 0) / data.length;

        return [averageBalanceBefore, cumulativeGrowth];
      },
    );

    // Compute total growth
    let total_weight = combination.reduce((acc, val) => acc + val[0], 0);
    let weighted_sum = combination.reduce(
      (acc, val) => acc + val[0] * val[1],
      0,
    );
    let weighted_avg = total_weight !== 0 ? weighted_sum / total_weight : 0;

    setTotalGrowth(weighted_avg);
  };

  useEffect(() => {
    if (isDataLoading || !currentAccount || !Object.keys(growthData).length)
      return;

    computeTotalProfits();
  }, [growthData, isDataLoading, currentAccount]);

  return isDataLoading ? (
    <Spinner />
  ) : (
    <Rate
      value={totalGrowth * 100}
      prefix="+"
      isUD7x3={false}
      className={className}
    />
  );
};
