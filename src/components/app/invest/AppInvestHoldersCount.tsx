import { Spinner } from "@/components/ui";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { FC, useEffect, useState } from "react";
import { createPublicClient, erc20Abi, http, zeroAddress } from "viem";
import { getContractEvents } from "viem/actions";
import { arbitrum, linea } from "viem/chains";
import { getContractAddress } from "@/lib/getContractAddress";

interface Props extends React.HTMLAttributes<HTMLDivElement> {}

const availableChains = [
  {
    id: "42161",
    startBlock: 211050n,
    viemObj: arbitrum,
  },
  {
    id: "59144",
    startBlock: 211050n,
    viemObj: linea,
  },
];

export const AppInvestHoldersCount: FC<Props> = (props) => {
  const [holdersCount, setHoldersCount] = useState<number | "N/A">("N/A");
  const [isLoading, setIsLoading] = useState(false);
  const lTokens = useAvailableLTokens();

  const computeHoldersCount = async () => {
    setIsLoading(true);
    let totalHolders = 0;
    for (const chain of availableChains) {
      const client = createPublicClient({
        chain: chain.viemObj,
        transport: http(),
      });
      for (const lTokenSymbol of lTokens) {
        const lTokenAddress = getContractAddress(lTokenSymbol, chain.id);
        // Retrieve all L-Token transfers events
        const logs = await getContractEvents(client, {
          address: lTokenAddress,
          abi: erc20Abi,
          eventName: "Transfer",
          fromBlock: chain.startBlock,
          toBlock: "latest",
        });

        // Retrieve all current and past holders
        const holders = new Set<string>();
        logs.forEach((log) => {
          if (
            log.args.from &&
            ![lTokenAddress, zeroAddress].includes(log.args.from)
          )
            holders.add(log.args.from);
          if (
            log.args.to &&
            ![lTokenAddress, zeroAddress].includes(log.args.to)
          )
            holders.add(log.args.to);
        });

        // Update total holders count
        totalHolders += holders.size;
      }
    }
    setHoldersCount(totalHolders);
    setIsLoading(false);
  };

  useEffect(() => {
    computeHoldersCount();
  }, []);

  return <div {...props}>{(isLoading && <Spinner />) || holdersCount}</div>;
};
