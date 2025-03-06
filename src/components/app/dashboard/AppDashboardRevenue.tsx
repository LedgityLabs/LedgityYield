import { Amount, Card, Spinner } from "@/components/ui";
import React, { useEffect, useState } from "react";
import {
  useGrowthRevenueData,
  GraphTokenEntry,
  GraphTokenData,
} from "@/hooks/subgraph/useGrowthRevenueData";

export const AppDashboardRevenue: React.PropsWithoutRef<typeof Card> = ({
  className,
}) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  // const { growthData, isDataLoading } = useGrowthRevenueData();
  const growthData: GraphTokenData = {};
  const isDataLoading = false;
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
    setTotalRevenue(cumulatedRevenue);
  };

  useEffect(() => {
    if (!isDataLoading) computeTotalProfits();
  }, [growthData, isDataLoading]);

  if (isDataLoading) return <Spinner />;
  else return <Amount value={totalRevenue} prefix="$" className={className} />;
};
