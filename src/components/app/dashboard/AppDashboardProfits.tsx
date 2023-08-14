import { Amount, Card, Rate, Spinner } from "@/components/ui";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useGrowthRevenueData } from "./useGrowthRevenueData";

export const AppDashboardProfits: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  const [totalGrowth, setTotalGrowth] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { data, isDataLoading } = useGrowthRevenueData();

  const computeTotalProfits = () => {
    let _totalRevenue = 0;
    const combination: [number, number][] = [];

    // Loop over all keys in the object
    for (const lTokenSymbol in data) {
      // Compute cumulative revenue for this L-Token
      const lTokenTotalRevenue = data[lTokenSymbol].reduce((acc, value) => acc + value.revenue, 0);
      _totalRevenue += lTokenTotalRevenue;

      //  Compute cumulative growth and average balance before for this L-Token
      const cumulativeGrowth = data[lTokenSymbol].reduce((acc, val) => acc + val.growth, 0);
      const averageBalanceBefore =
        data[lTokenSymbol].reduce((acc, val) => acc + val.balanceBefore, 0) /
        data[lTokenSymbol].length;
      combination.push([averageBalanceBefore, cumulativeGrowth]);
    }
    setTotalRevenue(_totalRevenue);

    // Compute total growth
    let total_weight = combination.reduce((acc, val) => acc + val[0], 0);
    let weighted_sum = combination.reduce((acc, val) => acc + val[0] * val[1], 0);
    let weighted_avg = total_weight !== 0 ? weighted_sum / total_weight : 0;
    setTotalGrowth(weighted_avg);
  };

  useEffect(() => {
    if (!isDataLoading) computeTotalProfits();
  }, [data, isDataLoading]);

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge(
        "flex flex-col items-center justify-between px-7 py-4 [&:hover_>_span:first-of-type_>_span]:opacity-50 [&:hover_>_span:last-of-type]:opacity-100",
        className,
      )}
    >
      <h2 className="text-center font-heading text-xl font-bold text-indigo-300 grayscale-[50%]">
        Total profits
      </h2>
      {(isDataLoading && (
        <div className="flex h-full items-center justify-center">
          <Spinner />
        </div>
      )) || (
        <>
          <span className="font-heavy text-center font-heading text-5xl font-bold text-emerald-500 transition-opacity">
            <Rate
              value={totalGrowth * 100}
              prefix="+"
              isUD7x3={false}
              className="transition-opacity"
            />
          </span>
          <span className="font-heavy text-center font-heading text-2xl text-emerald-500 opacity-50 transition-opacity">
            <span className="text-fg/20">(</span>
            <Amount value={totalRevenue} prefix="+$" />
            <span className="text-fg/20">)</span>
          </span>
        </>
      )}
    </Card>
  );
};
