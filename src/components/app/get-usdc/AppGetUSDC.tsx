import { FC } from "react";
import { AppBridgeUSDC } from "./AppBridgeUSDC";
import { AppSwapUSDC } from "./AppSwapUSDC";
import { AppBorrowUSDC } from "./AppBorrowUSDC";

export const AppGetUSDC: FC = () => {
  return (
    <section className="grid h-[900px] w-[1200px] grid-cols-[repeat(3,1fr)] gap-10 pb-10">
      <AppBridgeUSDC />
      <AppSwapUSDC />
      <AppBorrowUSDC />
    </section>
  );
};
