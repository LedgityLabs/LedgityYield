import { Amount, Card, Rate, Spinner } from "@/components/ui";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useGrowthRevenueData } from "./useGrowthRevenueData";

interface Combination {
  totalRevenue: number;
  weightedGrowth: number;
}

export const AppDashboardGrowth: React.FC<React.ComponentPropsWithoutRef<typeof Card>> = ({ 
  className 
}) => {
  const [totalGrowth, setTotalGrowth] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { data, isDataLoading } = useGrowthRevenueData();

  const computeTotalProfits = useCallback(() => {
    if (!data) return;

    let _totalRevenue = 0;
    const combination: [number, number][] = [];

    // Loop over all keys in the object
    Object.entries(data).forEach(([lTokenSymbol, lTokenData]) => {
      // Compute cumulative revenue for this L-Token
      const lTokenTotalRevenue = lTokenData.reduce(
        (acc, value) => acc + value.revenue,
        0
      );
      _totalRevenue += lTokenTotalRevenue;

      // Compute cumulative growth and average balance before for this L-Token
      const cumulativeGrowth = lTokenData.reduce(
        (acc, val) => acc + val.growth,
        0
      );
      
      const averageBalanceBefore = lTokenData.length > 0
        ? lTokenData.reduce((acc, val) => acc + val.balanceBefore, 0) / lTokenData.length
        : 0;

      combination.push([averageBalanceBefore, cumulativeGrowth]);
    });

    // Compute total growth using memoized reduction
    const total_weight = combination.reduce((acc, val) => acc + val[0], 0);
    const weighted_sum = combination.reduce((acc, val) => acc + val[0] * val[1], 0);
    const weighted_avg = total_weight !== 0 ? weighted_sum / total_weight : 0;

    setTotalGrowth(weighted_avg);
    setTotalRevenue(_totalRevenue);
  }, [data]);

  useEffect(() => {
    if (!isDataLoading && data) {
      computeTotalProfits();
    }
  }, [isDataLoading, data, computeTotalProfits]);

  if (isDataLoading) {
    return <Spinner />;
  }

  return (
    <Rate 
      value={totalGrowth * 100} 
      prefix="+" 
      isUD7x3={false} 
      className={className} 
    />
  );
};

export default AppDashboardGrowth;