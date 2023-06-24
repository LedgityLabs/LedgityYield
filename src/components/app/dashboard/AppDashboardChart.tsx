import { Card, Switch, RadioGroup, RadioGroupItem } from "@/components/ui";
import React from "react";
import { twMerge } from "tailwind-merge";

export const AppDashboardChart: React.PropsWithoutRef<typeof Card> = ({ className }) => {
  return (
    <Card
      circleIntensity={0.07}
      className={twMerge("flex flex-col justify-center items-center  p-7 pb-10", className)}
    >
      <div className="h-full w-full bg-primary/10 rounded-3xl flex justify-center items-center">
        Chart (coming soon)
      </div>
      <div className="flex flex-col gap-5 justify-center items center mt-10">
        <div className="flex gap-3 justify-center items-center text-base font-semibold">
          <p>Revenue ($)</p>
          <Switch />
          <p>Growth (%)</p>
        </div>
        <RadioGroup defaultValue="three-months" className="flex gap-3 justify-center items-center">
          <RadioGroupItem
            value="seven-days"
            id="seven-days"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="option-one" className="pointer-events-none">
              7D
            </label>
          </RadioGroupItem>
          <RadioGroupItem
            value="one-month"
            id="one-month"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="option-one" className="pointer-events-none">
              1M
            </label>
          </RadioGroupItem>
          <RadioGroupItem
            value="three-months"
            id="three-months"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="option-one" className="pointer-events-none">
              3M
            </label>
          </RadioGroupItem>
          <RadioGroupItem
            value="one-year"
            id="one-year"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="option-one" className="pointer-events-none">
              1Y
            </label>
          </RadioGroupItem>
          <RadioGroupItem
            value="all"
            id="all"
            className="h-12 w-12 aspect-square flex justify-center items-center"
          >
            <label htmlFor="option-one" className="pointer-events-none">
              All
            </label>
          </RadioGroupItem>
        </RadioGroup>
      </div>
    </Card>
  );
};
