"use client";
import { Amount, Card, Spinner } from "@/components/ui";
import React, { useEffect, useState, useCallback } from "react";
import { useGrowthRevenueData } from "./useGrowthRevenueData";

interface TokenData {
  revenue: number;
  growth: number;
  balanceBefore: number;
}

export const AppDashboardRevenue: React.FC<React.ComponentPropsWithoutRef<typeof Card>> = ({ 
  className 
}) => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { data, isDataLoading } = useGrowthRevenueData();

  const computeTotalProfits = useCallback(() => {
    if (!data) return;

    let _totalRevenue = 0;

    // Loop over all keys in the object using Object.entries for better type safety
    Object.entries(data).forEach(([lTokenSymbol, tokenData]) => {
      // Compute cumulative revenue for this L-Token
      const lTokenTotalRevenue = tokenData.reduce(
        (acc: number, value: TokenData) => acc + value.revenue,
        0
      );
      _totalRevenue += lTokenTotalRevenue;
    });

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
    <Amount 
      value={totalRevenue} 
      prefix="$" 
      className={className} 
    />
  );
};

export default AppDashboardRevenue;