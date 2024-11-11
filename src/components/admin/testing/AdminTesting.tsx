import { Address, Amount, AmountInput, Button, Card, Input } from "@/components/ui";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useEffect, useMemo, useState, useCallback } from "react";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { TxButton } from "@/components/ui/TxButton";
import { createTestClient, erc20Abi, http, parseUnits, zeroAddress } from "viem";
import {
  UseSimulateContractReturnType,
  useAccount,
  useBlockNumber,
  useReadContract,
} from "wagmi";
import { AdminMasonry } from "../AdminMasonry";
import { AdminBrick } from "../AdminBrick";
import { hardhat } from "wagmi/chains";
import { useQueryClient } from "@tanstack/react-query";
import { useSimulateGenericErc20Mint } from "@/generated";

interface SimulationResult {
  data?: {
    request?: {
      [key: string]: unknown;
    };
  };
  [key: string]: unknown;
}

const convertSimulationToPreparation = (
  simulationResult: SimulationResult
): UseSimulateContractReturnType => ({
  ...simulationResult,
  data: simulationResult.data && 'request' in simulationResult.data
    ? {
        ...simulationResult.data,
        request: {
          ...simulationResult.data.request,
          __mode: "prepared" as const,
        },
      }
    : undefined,
}) as unknown as UseSimulateContractReturnType;

interface MintFakeTokenProps {
  contractName: string;
  className?: string;
}

const MintFakeToken: FC<MintFakeTokenProps> = ({ contractName, ...props }) => {
  const account = useAccount();
  const address = useContractAddress(contractName);
  
  const { data: tokenSymbol } = useReadContract({
    abi: erc20Abi,
    functionName: "symbol",
    address: address,
  });
  
  const { data: tokenName } = useReadContract({
    abi: erc20Abi,
    functionName: "name",
    address: address,
  });
  
  const { data: tokenDecimals } = useReadContract({
    abi: erc20Abi,
    functionName: "decimals",
    address: address,
  });
  
  const { data: tokenBalance, queryKey } = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    address: address,
    args: [account.address || zeroAddress],
  });

  const [mintedAmount, setMintedAmount] = useState(0n);

  // Get simulation with proper options
  const simulationResult = useSimulateGenericErc20Mint({
    address: address,
    args: [mintedAmount],
    query: {
      enabled: Boolean(address && mintedAmount > 0n),
    },
  });

  // Convert simulation to preparation with proper type checking
  const preparation = useMemo(
    () => convertSimulationToPreparation(simulationResult),
    [simulationResult]
  );

  // Handle data refresh
  const queryClient = useQueryClient();
  const { data: blockNumber } = useBlockNumber({ watch: true });

  const handleRefreshData = useCallback(() => {
    if (queryKey) {
      queryClient.invalidateQueries({ queryKey });
    }
  }, [queryClient, queryKey]);

  useEffect(() => {
    if (blockNumber && blockNumber % 5n === 0n) {
      handleRefreshData();
    }
  }, [blockNumber, handleRefreshData]);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (tokenDecimals) {
      setMintedAmount(value ? parseUnits(value, tokenDecimals) : 0n);
    }
  };

  if (!address || !tokenDecimals) return null;

  return (
    <div {...props} className="mt-8">
      <h4 className="text-lg font-semibold">{tokenName}</h4>
      <ul className="pl-4 flex flex-col gap-2 py-2 list-disc">
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Address</h5>
          <Address address={address} copyable={true} addToWallet={true} tooltip={true} />
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Symbol</h5>
          <span>{tokenSymbol}</span>
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Decimals</h5>
          <span>{tokenDecimals}</span>
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Your balance</h5>
          <span>
            <Amount value={tokenBalance || 0n} decimals={tokenDecimals} />
          </span>
        </li>
        <li className="flex flex-col">
          <h5 className="font-bold text-fg/60">Mint</h5>
          <div className="flex justify-end items-end gap-4">
            <AmountInput
              maxName="Max"
              maxValue={parseUnits("9999999", tokenDecimals)}
              decimals={tokenDecimals}
              onChange={handleAmountChange}
            />
            <TxButton
              size="medium"
              preparation={preparation}
              disabled={mintedAmount === 0n}
            >
              Mint
            </TxButton>
          </div>
        </li>
      </ul>
    </div>
  );
};

export const AdminTesting: FC = () => {
  const lTokens = useAvailableLTokens();
  const [dayForwards, setDayForwards] = useState(0);

  const testClient = useMemo(
    () => createTestClient({
      chain: hardhat,
      mode: "hardhat",
      transport: http(),
    }),
    []
  );

  const handleDayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDayForwards(value ? Number(value) : 0);
  };

  const handleTimeIncrease = useCallback(() => {
    if (dayForwards > 0) {
      testClient.increaseTime({ seconds: dayForwards * 24 * 60 * 60 });
    }
  }, [dayForwards, testClient]);

  const handleMineBlock = useCallback(() => {
    testClient.mine({ blocks: 1 });
  }, [testClient]);

  return (
    <AdminMasonry>
      <AdminBrick title="Underlying tokens">
        <p>
          When Ledgity Yield is deployed locally, fake stablecoins contracts are also automatically
          deployed to mimic mainnets&apos; ones.
          <br />
          <br />
          Here are those for the current local network:
        </p>
        {lTokens.map((lToken) => (
          <MintFakeToken key={lToken} contractName={lToken.slice(1)} />
        ))}
      </AdminBrick>
      <AdminBrick title="LDY token">
        <p>
          When Ledgity Yield is deployed locally, a fake $LDY token contract is also automatically
          deployed to mimic the mainnets&apos; ones.
          <br />
          <br />
          Here is the one for the local test network:
        </p>
        <MintFakeToken contractName="LDY" />
      </AdminBrick>
      <AdminBrick title="Increase block time">
        <div className="flex flex-col justify-center items-center gap-3">
          <p>
            Warning: When local chain timestamp is moved forward, the JS `Date.now()` is still at
            current timestamp. This may produce unwanted results if on-chain timestamps are for
            example compared to JS ones.
          </p>
          <Input
            type="number"
            placeholder="Number of days"
            onChange={handleDayChange}
            min={0}
          />
          <Button 
            onClick={handleTimeIncrease}
            disabled={dayForwards <= 0}
          >
            Increase time
          </Button>
        </div>
      </AdminBrick>
      <AdminBrick title="Mint block">
        <Button onClick={handleMineBlock}>
          Mint one block
        </Button>
      </AdminBrick>
    </AdminMasonry>
  );
};