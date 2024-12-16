import { Amount, Card, Rate, Spinner } from "@/components/ui";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useGrowthRevenueData } from "./useGrowthRevenueData";

export const AppDashboardRevenue: React.PropsWithoutRef<typeof Card> = ({
  className,
}) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { data, isDataLoading } = useGrowthRevenueData();

  const computeTotalProfits = () => {
    let _totalRevenue = 0;
    const combination: [number, number][] = [];

    // Loop over all keys in the object
    for (const lTokenSymbol in data) {
      // Compute cumulative revenue for this L-Token
      const lTokenTotalRevenue = data[lTokenSymbol].reduce(
        (acc, value) => acc + value.revenue,
        0,
      );
      _totalRevenue += lTokenTotalRevenue;

      //  Compute cumulative growth and average balance before for this L-Token
      const cumulativeGrowth = data[lTokenSymbol].reduce(
        (acc, val) => acc + val.growth,
        0,
      );
      const averageBalanceBefore =
        data[lTokenSymbol].reduce((acc, val) => acc + val.balanceBefore, 0) /
        data[lTokenSymbol].length;
      combination.push([averageBalanceBefore, cumulativeGrowth]);
    }
    setTotalRevenue(_totalRevenue);
  };

  useEffect(() => {
    if (!isDataLoading) computeTotalProfits();
  }, [data, isDataLoading]);

  if (isDataLoading) return <Spinner />;
  else return <Amount value={totalRevenue} prefix="$" className={className} />;
};
