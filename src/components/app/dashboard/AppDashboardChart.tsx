import { Card, Switch, RadioGroup, RadioGroupItem, formatAmount, Spinner } from "@/components/ui";
import React, { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import {
  Chart,
  ChartConfiguration,
  ChartConfigurationCustomTypesPerDataset,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  TimeScale,
  TimeSeriesScale,
  LogarithmicScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-luxon";
import { Activity, LToken, RewardsMint, execute } from "../../../../.graphclient";
import { usePublicClient, useWalletClient } from "wagmi";
import { getTokenUSDRate } from "@/lib/getTokenUSDRate";
import { ContractId, LTokenId } from "../../../../hardhat/deployments";
import { formatUnits, parseUnits } from "viem";
import { readLToken } from "@/generated";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { getContractAddress } from "@/lib/getContractAddress";
Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  TimeScale,
  TimeSeriesScale,
  LogarithmicScale
);

const secondsPerDay = 60 * 60 * 24;

export const AppDashboardChart: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  const lTokens = useAvailableLTokens();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const [period, setPeriod] = useState("90");
  const [type, setType] = useState<"revenue" | "growth">("revenue");
  const [labels, setLabels] = useState<Date[]>([]);
  const [revenueData, setRevenueData] = useState<number[]>([]);
  const [growthData, setGrowthData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  let delayed: boolean;
  let investmentStarts: Record<string, number> = {};

  const computeLabels = async () => {
    let _labels: Date[] = [];
    let numberOfDays = 0;
    if (period !== "all") numberOfDays = Number(period);
    else {
      const oldestInvestmentStart = Math.min(...Object.values(investmentStarts));
      numberOfDays =
        oldestInvestmentStart !== null
          ? (Date.now() / 1000 - oldestInvestmentStart) / secondsPerDay
          : 365;
    }

    const startTimestamp = Math.floor(Date.now() / 1000) - numberOfDays * secondsPerDay;
    let chunksNumber;
    if (numberOfDays === 7) chunksNumber = 7;
    else if (numberOfDays === 30) chunksNumber = 10;
    else if (numberOfDays === 90) chunksNumber = 12;
    else if (numberOfDays === 365) chunksNumber = 15;
    else chunksNumber = 30;

    const chunkSize = numberOfDays / chunksNumber;
    const chunkTime = chunkSize * secondsPerDay;
    for (let i = 0; i < chunksNumber; i++) {
      const timestamp = startTimestamp + i * chunkTime;
      const datetime = new Date(timestamp * 1000);
      if (numberOfDays < chunksNumber) _labels.push(datetime);
      else _labels.push(datetime);
    }

    return {
      _labels,
      chunkTime,
    };
  };

  const computeData = async () => {
    setIsLoading(true);
    // ### Build raw data ###
    const data = {} as Record<
      string,
      {
        timestamp: number;
        revenue: number;
        balanceBefore: number;
        growth: number;
      }[]
    >;
    lTokens.forEach((lToken) => (data[lToken] = []));

    const investmentStartRequest: {
      data: {
        ltokens: LToken[] & {
          activities: Activity[];
        };
      };
    } = await execute(
      `
    {
      ltokens {
        symbol
        activities(where: {account: "${
          walletClient!.account.address
        }" }, orderBy: timestamp, orderDirection: asc, first: 1) {
          timestamp
        }
      }
    }
    `
    );

    // Retrive investment start timestamp
    for (const lToken of investmentStartRequest.data.ltokens) {
      if (lToken.activities && lToken.activities.length > 0) {
        investmentStarts[lToken.symbol] = Number(lToken.activities[0].timestamp);
        data[lToken.symbol].push({
          timestamp: investmentStarts[lToken.symbol],
          revenue: 0,
          balanceBefore: 0,
          growth: 0,
        });
      }
    }

    const results: {
      data: {
        rewardsMints: [
          RewardsMint & {
            ltoken: LToken;
          }
        ];
      };
    } = await await execute(
      `
      {
        rewardsMints(where: { account: "${
          walletClient!.account.address
        }" }, orderBy: timestamp, orderDirection: asc) {
          timestamp
          revenue
          growth
          balanceBefore
          ltoken {
            id
            symbol
            decimals
          }
        }
      }
    `
    );
    // - Push all rewards mints into raw data
    for (const rewardsMint of results.data.rewardsMints) {
      const usdRate = await getTokenUSDRate(rewardsMint.ltoken.symbol.slice(1) as ContractId);

      // Convert revenue to decimals and then to USD
      let revenue = Number(formatUnits(BigInt(rewardsMint.revenue), rewardsMint.ltoken.decimals));
      revenue = revenue * usdRate;

      // Convert balance before to decimals and then to USD
      let balanceBefore = Number(
        formatUnits(BigInt(rewardsMint.balanceBefore), rewardsMint.ltoken.decimals)
      );
      balanceBefore = balanceBefore * usdRate;

      data[rewardsMint.ltoken.symbol].push({
        timestamp: Number(rewardsMint.timestamp),
        revenue: revenue,
        balanceBefore: balanceBefore,
        growth: Number(rewardsMint.growth),
      });
    }

    // - Push not yet minted rewards into raw data
    for (const lToken of lTokens) {
      const lTokenAddress = getContractAddress(lToken, publicClient.chain.id)!;
      const decimals = await readLToken({
        address: lTokenAddress,
        functionName: "decimals",
      });
      const _balanceBefore = await readLToken({
        address: lTokenAddress,
        functionName: "realBalanceOf",
        args: [walletClient!.account.address],
      });
      const unclaimedRewards = await readLToken({
        address: lTokenAddress,
        functionName: "unmintedRewardsOf",
        args: [walletClient!.account.address],
      });
      const usdRate = await getTokenUSDRate(lToken.slice(1) as ContractId);

      // Convert revenue to decimals and then to USD
      let revenue = Number(formatUnits(unclaimedRewards, decimals));
      revenue = revenue * usdRate;

      // Convert balance before to decimals and then to USD
      let balanceBefore = Number(formatUnits(_balanceBefore, decimals));
      balanceBefore = balanceBefore * usdRate;

      data[lToken].push({
        timestamp: Math.floor(Date.now() / 1000),
        revenue: revenue,
        balanceBefore: balanceBefore,
        growth: balanceBefore ? revenue / balanceBefore : 0,
      });
    }

    // ### Compute labels (x) ###
    const { _labels, chunkTime } = await computeLabels();

    // ### Build growth and revenue data (y) ###
    let _growthData: number[] = new Array(_labels.length).fill(0);
    let _revenueData: number[] = new Array(_labels.length).fill(0);

    // Reverse data and label array so the most recent data is first
    for (const lToken of lTokens) {
      data[lToken].reverse();
    }
    const reversedLabels = [..._labels].reverse();

    const emptyGrowthData: Record<string, [number, number]> = {};
    lTokens.forEach((lToken) => (emptyGrowthData[lToken] = [0, 0]));
    const perLabelGrowthData: Record<string, [number, number]>[] = new Array(_labels.length)
      .fill(null)
      .map(() => JSON.parse(JSON.stringify(emptyGrowthData)));

    for (const lToken of lTokens) {
      let currentLabelIndex = 0;
      let currentLabel = reversedLabels[currentLabelIndex];
      let nextLabel = reversedLabels[currentLabelIndex + 1];
      let currentLabelGrowthData = {
        cumulatedBalanceBefore: 0,
        cumulatedGrowth: 0,
        count: 0,
      };

      function fillCurrentLabelGrowthData() {
        if (currentLabelGrowthData.count == 0) perLabelGrowthData[currentLabelIndex][lToken] = [0, 0];
        else
          perLabelGrowthData[currentLabelIndex][lToken] = [
            currentLabelGrowthData.cumulatedBalanceBefore / currentLabelGrowthData.count,
            currentLabelGrowthData.cumulatedGrowth,
          ];

        // Reset current label growth data
        currentLabelGrowthData = {
          cumulatedBalanceBefore: 0,
          cumulatedGrowth: 0,
          count: 0,
        };
      }

      function incrementLabel() {
        fillCurrentLabelGrowthData();
        currentLabelIndex++;
        currentLabel = reversedLabels[currentLabelIndex];
        nextLabel = reversedLabels[currentLabelIndex + 1];
      }

      // Note that we iterate from newest to oldest data (as the data array is reversed)
      for (let i = 0; i < data[lToken].length; i++) {
        const dataPoint = data[lToken][i];
        const nextDataPoint = data[lToken][i + 1];

        // If there is no next data point
        if (!nextDataPoint) {
          _revenueData[currentLabelIndex] += dataPoint.revenue;
          currentLabelGrowthData.cumulatedGrowth += dataPoint.growth;
          currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
          currentLabelGrowthData.count++;
          break;
        }

        // Or if next data point starts at the same label
        else if (nextDataPoint.timestamp > currentLabel.getTime() / 1000) {
          _revenueData[currentLabelIndex] += dataPoint.revenue;
          currentLabelGrowthData.cumulatedGrowth += dataPoint.growth;
          currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
          currentLabelGrowthData.count++;
        }

        // Or if there is no next label
        else if (!nextLabel) {
          //
          const timeUntilEndOfLabel = dataPoint.timestamp - currentLabel.getTime() / 1000;
          // Retrieve the time span between current data point and the next one
          const timeUntilNextDataPoint = dataPoint.timestamp - nextDataPoint.timestamp;
          const proportion = timeUntilEndOfLabel / timeUntilNextDataPoint;
          _revenueData[currentLabelIndex] += dataPoint.revenue;
          currentLabelGrowthData.cumulatedGrowth += dataPoint.growth * proportion;
          currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
          currentLabelGrowthData.count++;

          break;
        }

        // Else
        else {
          // Retrieve the time span between current data point and the next one
          const timeUntilNextDataPoint = dataPoint.timestamp - nextDataPoint.timestamp;

          // Handle "dataPoint to current label end" distance
          const proportion1 =
            (dataPoint.timestamp - currentLabel.getTime() / 1000) / timeUntilNextDataPoint;
          _revenueData[currentLabelIndex] += dataPoint.revenue * proportion1;
          currentLabelGrowthData.cumulatedGrowth += dataPoint.growth * proportion1;
          currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
          currentLabelGrowthData.count++;

          incrementLabel();

          // Handle every entirely crossed label chunks
          const entireChunkProportion = chunkTime / timeUntilNextDataPoint;

          // Update next label index and new start label
          while (currentLabel.getTime() / 1000 > nextDataPoint.timestamp) {
            _revenueData[currentLabelIndex] += dataPoint.revenue * entireChunkProportion;
            currentLabelGrowthData.cumulatedGrowth += dataPoint.growth * entireChunkProportion;
            currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
            currentLabelGrowthData.count++;
            if (!nextLabel) break;
            incrementLabel();
          }

          // Handle "last label start to next data point" distance
          const proportion2 =
            (chunkTime - (nextDataPoint.timestamp - currentLabel.getTime() / 1000)) /
            timeUntilNextDataPoint;
          _revenueData[currentLabelIndex] += dataPoint.revenue * proportion2;
          currentLabelGrowthData.cumulatedGrowth += dataPoint.growth * proportion2;
          currentLabelGrowthData.cumulatedBalanceBefore += dataPoint.balanceBefore;
          currentLabelGrowthData.count++;
        }
      }
      fillCurrentLabelGrowthData();
    }

    for (let i = 0; i < _labels.length; i++) {
      const combinedData: [number, number][] = [];
      for (const lToken of lTokens) {
        combinedData.push([perLabelGrowthData[i][lToken][0], perLabelGrowthData[i][lToken][1]]);
      }
      let total_weight = combinedData.reduce((acc, val) => acc + val[0], 0);
      let weighted_sum = combinedData.reduce((acc, val) => acc + val[0] * val[1], 0);
      let weighted_avg = total_weight !== 0 ? weighted_sum / total_weight : 0;
      _growthData[i] += weighted_avg;
    }

    // Set new data and labels
    setLabels(_labels);
    setGrowthData(_growthData.reverse());
    setRevenueData(_revenueData.reverse());
    setIsLoading(false);
  };

  useEffect(() => {
    if (walletClient) computeData();
  }, [period, type]);

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-center items-center p-7 pb-10", className)}
    >
      <div className="h-full w-full bg-primary/10 rounded-3xl flex justify-center items-end">
        <div className="p-4 w-full h-full ">
          {isLoading ? (
            <div className="w-full h-full flex justify-center items-center bg/primary-10 animate-fadeIn">
              <Spinner />
            </div>
          ) : (
            <div className="w-full h-full pt-3">
              <Bar
                options={{
                  plugins: {
                    tooltip: {
                      backgroundColor: "rgb(30 41 59)",
                      footerSpacing: 5,
                      titleSpacing: 10,
                      titleFont: {
                        family: "var(--font-body)",
                        weight: "bold",
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
                        title: function (tooltipItems) {
                          if (type === "revenue")
                            return `Revenue:  $${tooltipItems[0].parsed.y.toString()}`;
                          else
                            return `Growth:  ${tooltipItems[0].parsed.y * 100}% (raw: ${
                              tooltipItems[0].parsed.y
                            }%)`;
                        },
                        label: function (tooltipItem) {
                          return "";
                        },
                        footer(tooltipItems) {
                          const dataIndex = tooltipItems[0].dataIndex;

                          let from = labels![dataIndex].toLocaleDateString();
                          let to = "now";
                          if (labels![dataIndex + 1]) to = labels![dataIndex + 1].toLocaleDateString();

                          // Return the appropriate label here
                          return `From:  ${from}\nTo:       ${to}`;
                        },
                      },
                    },
                  },
                  // Taken from: https://www.chartjs.org/docs/latest/samples/animations/delay.html
                  animation: {
                    onComplete: () => {
                      delayed = true;
                    },
                    delay: (context) => {
                      let delay = 0;
                      if (context.type === "data" && context.mode === "default" && !delayed) {
                        delay = context.dataIndex * 50;
                      }
                      return delay;
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
                      // type: "logarithmic",
                      display: false,
                      ticks: {},
                    },
                    x: {
                      type: "time",
                      ticks: {
                        source: "labels",
                        font: {
                          family: "var(--font-body)",
                          weight: "bold",
                        },
                      },
                    },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                data={{
                  labels: labels,
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
                }}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-5 justify-center items center mt-10">
        <div className="flex gap-3 justify-center items-center text-base font-semibold">
          <p>Revenue ($)</p>
          <Switch
            disabled={isLoading}
            onCheckedChange={(checked) => setType(checked ? "growth" : "revenue")}
          />
          <p>Growth (%)</p>
        </div>
        <RadioGroup
          disabled={isLoading}
          defaultValue="90"
          onValueChange={(value) => setPeriod(value)}
          className="flex gap-3 justify-center items-center"
        >
          <RadioGroupItem
            value="7"
            id="7"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="7" className="pointer-events-none">
              7D
            </label>
          </RadioGroupItem>
          <RadioGroupItem
            value="30"
            id="30"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="30" className="pointer-events-none">
              1M
            </label>
          </RadioGroupItem>
          <RadioGroupItem
            value="90"
            id="90"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="90" className="pointer-events-none">
              3M
            </label>
          </RadioGroupItem>
          <RadioGroupItem
            value="365"
            id="365"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="365" className="pointer-events-none">
              1Y
            </label>
          </RadioGroupItem>
          <RadioGroupItem
            value="all"
            id="all"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="all" className="pointer-events-none">
              All
            </label>
          </RadioGroupItem>
        </RadioGroup>
      </div>
    </Card>
  );
};
