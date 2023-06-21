import { Card } from "@/components/ui";
import { FC } from "react";

export const AppStaking: FC = () => {
  return (
    <section className="grid grid-cols-5 grid-rows-[repeat(8,1fr)] w-[1200px] h-[900px] pb-10 gap-10">
      <Card className="flex justify-center items-center col-start-1 col-span-2 row-span-full ">
        <p>Explanations</p>
      </Card>
      <Card className="flex justify-center items-center row-span-2">
        <p>Current APR</p>
      </Card>
      <Card className="flex justify-center items-center row-span-2">
        <p>Total staked</p>
      </Card>
      <Card className="flex justify-center items-center row-span-2">
        <p>Tier</p>
      </Card>
      <Card className="flex justify-center items-center col-start-3 row-span-2 col-span-3">
        <p>Stake</p>
      </Card>
      <Card className="flex justify-center items-center col-start-3 row-span-2 col-span-3">
        <p>Claim</p>
      </Card>
      <Card className="flex justify-center items-center col-start-3 row-span-2 col-span-3">
        <p>Withdraw</p>
      </Card>
    </section>
  );
};
