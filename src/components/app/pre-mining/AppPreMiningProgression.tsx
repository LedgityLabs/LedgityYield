import { FC, useEffect } from "react";
import { Amount } from "@/components/ui";
import { useReadPreMiningTotalLocked } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { parseUnits } from "viem";
import { useBlockNumber } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

export const AppPreMiningProgression: FC<Props> = ({ ...props }) => {
  // Compute total locked progression
  const lockdropAddress = useContractAddress("ArbitrumPreMining");
  const { data: totalLocked, queryKey } = useReadPreMiningTotalLocked({
    //@ts-ignore
    address: lockdropAddress!,
  });
  let progression = 0;
  if (totalLocked)
    progression = Number(totalLocked) / Number(parseUnits((5_000_000).toString(), 6));
  // if (progression < 0.01) progression = 0.01;

  // Compute time progression
  // const endDate: Date | null = new Date("2023-10-07T00:00:00Z");
  // const oneDay = 24 * 60 * 60 * 1000;
  // let remainingDays = endDate !== null ? Math.floor((endDate.getTime() - Date.now()) / oneDay) : 0;
  // if (remainingDays < 0) remainingDays = 0;
  const endDate: Date | null = null;
  const remainingDays = 0;

  // Refresh some data every 5 blocks
  const queryKeys = [queryKey];
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const queryClient = useQueryClient();
  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n)
      queryKeys.forEach((k) => queryClient.invalidateQueries({ queryKey: k }));
  }, [blockNumber, ...queryKeys]);

  return (
    <div className="relative -mt-3 flex flex-col sm:w-80 w-[80%] items-end gap-1" {...props}>
      <div className="relative mt-7 h-[0.9rem] w-full rounded-md rounded-r-none border border-r-0 border-[#20456c]/20">
        <div className="absolute -right-[1px] -top-6 drop-shadow-lg">
          <div className="absolute -bottom-[1.3rem] right-0 z-10 h-8 w-0.5 rounded-full bg-[#20456c]/50"></div>
          <div className="relative z-10 h-4 w-5 rounded-sm rounded-br-none bg-[url('/assets/textures/checkboard.png')] bg-cover"></div>
        </div>
        <div
          className="relative h-full rounded-l-[0.340rem] bg-gradient-to-l from-[#0472B9] to-[#0472B9]/50 transition-[width] !duration-[1500ms]"
          style={{ width: progression * 100 + "%" }}
        >
          <div className="absolute -right-[1px] -top-7 flex animate-pulse items-center gap-2">
            <div className="absolute -bottom-[1.25rem] right-0 z-10 h-8 w-0.5  rounded-full bg-[#0472B9]"></div>
            <div className="whitespace-nowrap text-xs font-semibold text-[#20456c]/60 opacity-90">
              <Amount value={totalLocked} decimals={6} className="text-[#0472B9]" /> /{" "}
              <Amount value={5000000000000n} decimals={6} />
            </div>
            <div className="rounded-md rounded-br-none bg-[#0472B9] p-1 font-heading text-xs font-bold leading-none text-bg ">
              {(progression * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
      <p className="text-sm font-semibold text-[#20456c]/70">
        {(() => {
          if (!endDate)
            return (
              <span className="font-bold text-[#20456c]/90">The lockdrop has not started yet.</span>
            );
          else if (remainingDays === 0 || progression === 1)
            return <span className="font-bold text-[#20456c]/90">The lockdrop has ended.</span>;
          else
            return (
              <span>
                Only <span className="font-bold text-[#20456c]/90">{remainingDays}</span> days left.
              </span>
            );
        })()}
      </p>
    </div>
  );
};
