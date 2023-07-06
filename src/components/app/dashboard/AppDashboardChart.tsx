import { Card, Switch, RadioGroup, RadioGroupItem, formatAmount } from "@/components/ui";
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
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "chartjs-adapter-luxon";
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, TimeScale, TimeSeriesScale);

const secondsPerDay = 60 * 60 * 24;

export const AppDashboardChart: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  const [period, setPeriod] = useState("90");
  const [type, setType] = useState<"revenue" | "growth">("revenue");
  const [data, setData] = useState<
    | ChartConfiguration<"bar", number[], unknown>["data"]
    | ChartConfigurationCustomTypesPerDataset<"bar", number[], unknown>["data"]
  >({
    labels: [], // x-axis labels, should represent chunks of time
    datasets: [
      {
        label: "Revenue",
        data: [], // y-axis data, should represent revenue
      },
    ],
  });
  const options:
    | ChartConfiguration<"bar", number[], unknown>["options"]
    | ChartConfigurationCustomTypesPerDataset<"bar", number[], unknown>["options"] = {
    plugins: {
      tooltip: {
        backgroundColor: "rgb(30 41 59)",
        footerSpacing: 5,
        titleSpacing: 10,
        titleFont: {
          family: "Poppins",
          weight: "bold",
          size: 18,
        },
        footerFont: {
          family: "Poppins",
          size: 13,
        },
        footerColor: "rgb(255 255 255 / 0.6)",
        padding: 15,
        cornerRadius: 10,
        callbacks: {
          title: function (tooltipItems) {
            return `Revenue: $${formatAmount(BigInt(tooltipItems[0].parsed.y.toString()), 6)}`;
          },
          label: function (tooltipItem) {
            return "";
          },
          footer(tooltipItems) {
            const dataIndex = tooltipItems[0].dataIndex;

            // @ts-ignore
            let from = data.labels![dataIndex].toLocaleDateString();
            let to = "now";
            // @ts-ignore
            if (data.labels![dataIndex + 1]) to = data.labels![dataIndex + 1].toLocaleDateString();

            // Return the appropriate label here
            return `From:  ${from}\nTo:    ${to}`;
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 10,
        inflateAmount: 1,
        backgroundColor: "rgb(99 102 241 / 0.7)",
        hoverBackgroundColor: "rgb(99 102 241)",
        borderWidth: 0,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        display: false,
        ticks: {
          callback: function (value, index, values) {
            return "$" + value;
          },
        },
      },
      x: {
        ticks: {
          source: "labels",
          autoSkip: true,
          maxTicksLimit: 6,
          font: {
            family: "Inter",
            weight: "bold",
          },
        },
        type: "time",
        time: {
          // unit: "",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const computeLabels = () => {
    let _labels: Date[] = [];
    if (period !== "all") {
      const numberOfDays = Number(period);
      const startTimestamp = Math.floor(Date.now() / 1000) - numberOfDays * secondsPerDay;
      const chunks = 12;
      const chunkSize = numberOfDays / chunks;
      const chunkTime = chunkSize * secondsPerDay;
      for (let i = 0; i < chunks; i++) {
        const timestamp = startTimestamp + i * chunkTime;
        const datetime = new Date(timestamp * 1000);
        if (numberOfDays < chunks) _labels.push(datetime);
        else _labels.push(datetime);
      }
    } else {
    }
    return _labels;
  };

  const computeData = async () => {
    const _labels = computeLabels();
    let _data: number[] = [
      5129841, 6509841, 4798418, 5898410, 5098410, 6984116, 5984199, 5298410, 4984189, 9841565, 9841610,
      6984101,
    ];
    const newData = { ...data };
    newData.labels = _labels;
    newData.datasets[0].data = _data;
    setData(newData);
  };

  useEffect(() => {
    computeData();
  }, [period, type]);

  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-center items-center p-7 pb-10", className)}
    >
      <div className="h-full w-full bg-primary/10 rounded-3xl flex justify-center items-end">
        {/* <canvas ref={canva} /> */}
        <div className="p-4 w-full h-[80%]">
          <Bar options={options} data={data} />
        </div>
      </div>
      <div className="flex flex-col gap-5 justify-center items center mt-10">
        <div className="flex gap-3 justify-center items-center text-base font-semibold">
          <p>Revenue ($)</p>
          <Switch onCheckedChange={(checked) => setType(checked ? "growth" : "revenue")} />
          <p>Growth (%)</p>
        </div>
        <RadioGroup
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
