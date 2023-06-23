import { Card, Switch } from "@/components/ui";
import { FC } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui";
export const AppDashboard: FC = () => {
  return (
    <section className="grid grid-cols-[repeat(5,1fr)] grid-rows-[repeat(4,1fr)] w-[1200px] h-[900px] gap-10 pb-10">
      <Card circleIntensity={0.07} className="flex justify-center items-center ">
        <p>Holding</p>
      </Card>
      <Card circleIntensity={0.07} className="lex-col justify-center items-center py-4 px-4">
        <h2 className="text-center text-lg font-medium text-indigo-900/80">Total profits</h2>
        <div className="h-full -mt-5 flex justify-center items-center text-4xl font-heavy font-heading text-green-600">
          +133.14%
        </div>
      </Card>
      <Card
        circleIntensity={0.07}
        className="flex justify-center items-center row-start-2 row-span-3 col-span-2"
      >
        <p>Activity</p>
      </Card>
      <Card
        circleIntensity={0.07}
        className="flex flex-col justify-center items-center row-span-3 col-span-3 p-10"
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
      <Card circleIntensity={0.07} className="flex justify-center items-center col-start-3 col-span-3">
        <p>Get support</p>
      </Card>
    </section>
  );
};
