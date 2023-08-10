import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { useBlockNumber, useWalletClient } from "wagmi";

export const NetworkStatus: FC = () => {
  const { data: blockNumber, isLoading, isIdle, isError, isSuccess } = useBlockNumber();
  return (
    <p className="text-center text-sm">
      <span className="text-fg/70 text-center">Block n°</span>&nbsp;
      <br />
      <span className="inline-flex justify-center items-center gap-1 font-semibold text-base text-fg/90 text-center">
        {blockNumber?.toString()}
        <span className="rinline-block elative h-4 w-4 flex justify-center items-center ">
          <span
            className={twMerge(
              "inline-block absolute h-3 w-3 rounded-full animate-ping duration-[1500ms]",
              isSuccess && "bg-emerald-400",
              isError && "bg-red-500",
              (isLoading || isIdle) && "",
            )}
          ></span>
          <span
            className={twMerge(
              "inline-block absolute h-3 w-3 rounded-full",
              isSuccess && "bg-emerald-400",
              isError && "bg-red-500",
              (isLoading || isIdle) && "bg-orange-400",
            )}
          ></span>
        </span>
      </span>
    </p>
  );
};
