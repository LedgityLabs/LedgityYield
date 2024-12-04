"use client";
import {
  Card,
  Switch,
  RadioGroup,
  RadioGroupItem,
  formatAmount,
  Spinner,
  formatRate,
  Amount,
} from "@/components/ui";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { twMerge } from "tailwind-merge";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  TimeScale,
  TimeSeriesScale,
  LogarithmicScale,
  ChartData,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import { useGrowthRevenueData } from "./useGrowthRevenueData";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  TimeScale,
  TimeSeriesScale,
  LogarithmicScale,
);

const secondsPerDay = 60 * 60 * 24;

type ChartPeriod = "7" | "30" | "90" | "365" | "all";
type ChartType = "revenue" | "growth";

interface GrowthData {
  cumulatedBalanceBefore: number;
  cumulatedGrowth: number;
  count: number;
}

export const AppDashboardChart: React.FC<React.ComponentPropsWithoutRef<typeof Card>> = ({ 
  className 
}) => {
  const [period, setPeriod] = useState<ChartPeriod>("90");
  const [type, setType] = useState<ChartType>("revenue");
  const { data, isDataLoading, isDataError, dataErrorMessage } = useGrowthRevenueData();
  const [labels, setLabels] = useState<Date[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [growthData, setGrowthData] = useState<number[]>([]);
  const [delayed, setDelayed] = useState(false);

  const computeLabels = useCallback(() => {
    let _labels: Date[] = [];

    let numberOfDays = 0;
    if (period !== "all") {
      numberOfDays = Number(period);
    } else {
      const investmentStarts: number[] = [];
      if (data) {
        Object.values(data).forEach(lTokenData => {
          if (lTokenData.length > 0) {
            investmentStarts.push(lTokenData[0].timestamp);
          }
        });
      }

      if (investmentStarts.length === 0) return { _labels, chunkTime: 0 };

      const oldestInvestmentStart = Math.min(...investmentStarts);
      numberOfDays = oldestInvestmentStart !== null
        ? (Date.now() / 1000 - oldestInvestmentStart) / secondsPerDay
        : 365;
    }

    const startTimestamp = Math.floor(Date.now() / 1000) - numberOfDays * secondsPerDay;
    
    const chunksNumber = (() => {
      if (numberOfDays === 7) return 7;
      if (numberOfDays === 30) return 10;
      if (numberOfDays === 90) return 12;
      if (numberOfDays === 365) return 15;
      return 30;
    })();

    const chunkSize = numberOfDays / chunksNumber;
    const chunkTime = chunkSize * secondsPerDay;

    for (let i = 0; i < chunksNumber; i++) {
      const timestamp = startTimestamp + i * chunkTime;
      const datetime = new Date(timestamp * 1000);
      _labels.push(datetime);
    }

    return { _labels, chunkTime };
  }, [period, data]);

  const fillCurrentLabelGrowthData = useCallback((
    currentLabelGrowthData: GrowthData,
    currentLabelIndex: number,
    lToken: string,
    perLabelGrowthData: Record<string, [number, number]>[]
  ) => {
    if (currentLabelGrowthData.count === 0) {
      perLabelGrowthData[currentLabelIndex][lToken] = [0, 0];
    } else {
      perLabelGrowthData[currentLabelIndex][lToken] = [
        currentLabelGrowthData.cumulatedBalanceBefore / currentLabelGrowthData.count,
        currentLabelGrowthData.cumulatedGrowth,
      ];
    }
  }, []);

  const computeChartData = useCallback(() => {
    if (isDataError || !data) return;

    const { _labels, chunkTime } = computeLabels();
    if (!_labels.length) return;

    const _growthData: number[] = new Array(_labels.length).fill(0);
    const _revenueData: number[] = new Array(_labels.length).fill(0);

    const reversedData = JSON.parse(JSON.stringify(data));
    Object.keys(reversedData).forEach(key => {
      reversedData[key].reverse();
    });
    
    const reversedLabels = [..._labels].reverse();

    const emptyGrowthData: Record<string, [number, number]> = {};
    Object.keys(reversedData).forEach(lToken => {
      emptyGrowthData[lToken] = [0, 0];
    });

    const perLabelGrowthData: Record<string, [number, number]>[] = 
      new Array(_labels.length)
        .fill(null)
        .map(() => JSON.parse(JSON.stringify(emptyGrowthData)));

    for (const lToken of Object.keys(reversedData)) {
      let currentLabelIndex = 0;
      let currentLabel = reversedLabels[currentLabelIndex];
      let nextLabel = reversedLabels[currentLabelIndex + 1];
      let currentLabelGrowthData: GrowthData = {
        cumulatedBalanceBefore: 0,
        cumulatedGrowth: 0,
        count: 0,
      };

      const incrementLabel = () => {
        fillCurrentLabelGrowthData(currentLabelGrowthData, currentLabelIndex, lToken, perLabelGrowthData);
        currentLabelIndex++;
        currentLabel = reversedLabels[currentLabelIndex];
        nextLabel = reversedLabels[currentLabelIndex + 1];
        currentLabelGrowthData = {
          cumulatedBalanceBefore: 0,
          cumulatedGrowth: 0,
          count: 0,
        };
      };

      for (let i = 0; i < reversedData[lToken].length; i++) {
        const dataPoint = reversedData[lToken][i];
        const nextDataPoint = reversedData[lToken][i + 1];

        if (!nextDataPoint) {
          _revenueData[currentLabelIndex] += dataPoint.revenue;
          currentLabelGrowthData.cumulatedGrowth += dataPoint.growth;
          currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
          currentLabelGrowthData.count++;
          break;
        }

        if (nextDataPoint.timestamp > currentLabel.getTime() / 1000) {
          _revenueData[currentLabelIndex] += dataPoint.revenue;
          currentLabelGrowthData.cumulatedGrowth += dataPoint.growth;
          currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
          currentLabelGrowthData.count++;
        } else if (!nextLabel) {
          const timeUntilEndOfLabel = dataPoint.timestamp - currentLabel.getTime() / 1000;
          const timeUntilNextDataPoint = dataPoint.timestamp - nextDataPoint.timestamp;
          const proportion = timeUntilEndOfLabel / timeUntilNextDataPoint;
          
          _revenueData[currentLabelIndex] += dataPoint.revenue;
          currentLabelGrowthData.cumulatedGrowth += dataPoint.growth * proportion;
          currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
          currentLabelGrowthData.count++;
          break;
        } else {
          const timeUntilNextDataPoint = dataPoint.timestamp - nextDataPoint.timestamp;
          const proportion1 = (dataPoint.timestamp - currentLabel.getTime() / 1000) / timeUntilNextDataPoint;
          
          _revenueData[currentLabelIndex] += dataPoint.revenue * proportion1;
          currentLabelGrowthData.cumulatedGrowth += dataPoint.growth * proportion1;
          currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
          currentLabelGrowthData.count++;

          incrementLabel();

          const entireChunkProportion = chunkTime / timeUntilNextDataPoint;

          while (currentLabel && currentLabel.getTime() / 1000 > nextDataPoint.timestamp) {
            _revenueData[currentLabelIndex] += dataPoint.revenue * entireChunkProportion;
            currentLabelGrowthData.cumulatedGrowth += dataPoint.growth * entireChunkProportion;
            currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
            currentLabelGrowthData.count++;
            if (!nextLabel) break;
            incrementLabel();
          }

          if (currentLabel && nextDataPoint) {
            const proportion2 = (chunkTime - (nextDataPoint.timestamp - currentLabel.getTime() / 1000)) / timeUntilNextDataPoint;
            _revenueData[currentLabelIndex] += dataPoint.revenue * proportion2;
            currentLabelGrowthData.cumulatedGrowth += dataPoint.growth * proportion2;
            currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
            currentLabelGrowthData.count++;
          }
        }
      }
      fillCurrentLabelGrowthData(currentLabelGrowthData, currentLabelIndex, lToken, perLabelGrowthData);
    }

    for (let i = 0; i < _labels.length; i++) {
      const combinedData: [number, number][] = [];
      for (const lToken of Object.keys(perLabelGrowthData[i])) {
        combinedData.push([perLabelGrowthData[i][lToken][0], perLabelGrowthData[i][lToken][1]]);
      }
      const total_weight = combinedData.reduce((acc, val) => acc + val[0], 0);
      const weighted_sum = combinedData.reduce((acc, val) => acc + val[0] * val[1], 0);
      _growthData[i] += total_weight !== 0 ? weighted_sum / total_weight : 0;
    }

    setLabels(_labels);
    setGrowthData(_growthData.reverse());
    setRevenueData(_revenueData.reverse());
  }, [data, isDataError, computeLabels, fillCurrentLabelGrowthData]);

  useEffect(() => {
    if (!isDataLoading) {
      computeChartData();
    }
  }, [isDataLoading, computeChartData]);

  const chartOptions = useMemo((): ChartOptions<'bar'> => ({
    layout: {
      padding: { left: 0 },
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgb(30 41 59)",
        footerSpacing: 5,
        titleSpacing: 10,
        titleFont: {
          family: "var(--font-body)",
          weight: 'bold' as const,
          size: 18,
        },
        footerFont: {
          family: "var(--font-body)",
          size: 13,
        },
        footerColor: "rgb(255 255 255 / 0.6)",
        padding: 15,
        cornerRadius: 10,
        callbacks: {
          title(tooltipItems) {
            if (!tooltipItems.length) return '';
            if (type === "revenue") {
              return `Revenue:  $${formatAmount(tooltipItems[0].parsed.y)}`;
            }
            return `Growth:  ${formatRate(tooltipItems[0].parsed.y * 100, false)}%`;
          },
          label() {
            return "";
          },
          footer(tooltipItems) {
            if (!tooltipItems.length) return '';
            const dataIndex = tooltipItems[0].dataIndex;
            if (!labels[dataIndex]) return "";
            
            const from = labels[dataIndex].toLocaleDateString();
            const to = labels[dataIndex + 1] 
              ? labels[dataIndex + 1].toLocaleDateString() 
              : "now";
            
            return `From:  ${from}\nTo:       ${to}`;
          },
        },
      },
    },
    animation: {
      onComplete: () => {
        setDelayed(true);
      },
      delay(context) {
        if (context.type === "data" && context.mode === "default" && !delayed) {
          return context.dataIndex * 25;
        }
        return 0;
      },
    },
    elements: {
      bar: {
        borderRadius: 10,
        backgroundColor: "rgb(99 102 241 / 0.7)",
        hoverBackgroundColor: "rgb(99 102 241)",
        borderWidth: 0,
      },
    },
    scales: {
      y: {
        display: false,
      },
      x: {
        type: 'time' as const,
        time: {
          unit: 'day',
        },
        ticks: {
          source: 'labels' as const,
          font: {
            family: "var(--font-body)",
            weight: 'bold' as const,
          },
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  }), [type, labels, delayed]);

  const chartData = useMemo((): ChartData<'bar', number[], Date> => ({
    labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueData,
        hidden: type !== "revenue",
      },
      {
        label: "Growth",
        data: growthData,
        hidden: type !== "growth",
      },
    ],
  }), [labels, revenueData, growthData, type]);

  const handleTypeChange = useCallback((checked: boolean) => {
    setType(checked ? "growth" : "revenue");
  }, []);

  const handlePeriodChange = useCallback((value: string) => {
    setPeriod(value as ChartPeriod);
  }, []);

  return (
    <article className={twMerge("flex flex-col items-center justify-center p-8 pr-5", className)}>
      <div className="flex h-full w-full items-end justify-center rounded-3xl bg-primary/10">
        <div className="h-full w-full p-4">
          {(() => {
            if (isDataLoading) {
              return (
                <div className="bg/primary-10 flex h-full w-full animate-fadeIn items-center justify-center">
                  <Spinner />
                </div>
              );
            }
            
            if (isDataError) {
              return (
                <div className="bg/primary-10 flex h-full w-full animate-fadeIn items-center justify-center text-center text-lg font-semibold text-primary/80">
                  {dataErrorMessage}.
                </div>
              );
            }

            return (
              <div className="h-full w-full pt-3">
                <Bar options={chartOptions} data={chartData} />
              </div>
            );
          })()}
        </div>
      </div>
      <div className="items center mt-10 flex flex-col justify-center gap-5">
        <div className="flex items-center justify-center gap-3 text-base font-semibold">
          <p>Revenue ($)</p>
          <Switch
            disabled={isDataLoading || isDataError}
            onCheckedChange={handleTypeChange}
          />
          <p>Growth (%)</p>
        </div>
        <RadioGroup
          disabled={isDataLoading || isDataError}
          defaultValue="90"
          onValueChange={handlePeriodChange}
          className="flex items-center justify-center gap-3"
        >
          <RadioGroupItem
            value="7"
            id="7"
            className="flex aspect-square h-12 w-12 items-center justify-center"
          >
            <label htmlFor="7" className="pointer-events-none">7D</label>
          </RadioGroupItem>
          <RadioGroupItem
            value="30"
            id="30"
            className="flex aspect-square h-12 w-12 items-center justify-center"
          >
            <label htmlFor="30" className="pointer-events-none">1M</label>
          </RadioGroupItem>
          <RadioGroupItem
            value="90"
            id="90"
            className="flex aspect-square h-12 w-12 items-center justify-center"
          >
            <label htmlFor="90" className="pointer-events-none">3M</label>
          </RadioGroupItem>
          <RadioGroupItem
            value="365"
            id="365"
            className="flex aspect-square h-12 w-12 items-center justify-center"
          >
            <label htmlFor="365" className="pointer-events-none">1Y</label>
          </RadioGroupItem>
          <RadioGroupItem
            value="all"
            id="all"
            className="flex aspect-square h-12 w-12 items-center justify-center"
          >
            <label htmlFor="all" className="pointer-events-none">All</label>
          </RadioGroupItem>
        </RadioGroup>
      </div>
    </article>
  );
};

export default AppDashboardChart;