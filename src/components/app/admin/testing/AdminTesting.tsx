import { Address, Amount, AmountInput, Button, Card, Input } from "@/components/ui";
import {
  useGenericErc20Name,
  useGenericErc20Decimals,
  usePrepareGenericErc20Mint,
  useGenericErc20BalanceOf,
  useLTokenUnderlying,
  useGenericErc20Symbol,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { ContractId } from "../../../../../contracts/deployments";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { TxButton } from "@/components/ui/TxButton";
import { createTestClient, http, parseUnits } from "viem";
import { useWalletClient } from "wagmi";
import { AdminMasonry } from "../AdminMasonry";
import { AdminBrick } from "../AdminBrick";
import { hardhat } from "wagmi/chains";

const MintFakeToken: FC<{ contractId: ContractId }> = ({ contractId, ...props }) => {
  const { data: walletClient } = useWalletClient();
  const address = useContractAddress(contractId);
  const { data: tokenSymbol } = useGenericErc20Symbol({ address: address });
  const { data: tokenName } = useGenericErc20Name({ address: address });
  const { data: tokenDecimals } = useGenericErc20Decimals({
    address: address,
  });
  const { data: tokenBalance } = useGenericErc20BalanceOf({
    address: address,
    args: [walletClient ? walletClient.account.address : "0x0"],
    watch: true,
  });
  const [mintedAmount, setMintedAmount] = useState(0n);
  const preparation = usePrepareGenericErc20Mint({
    address: address,
    args: [mintedAmount],
  });

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
            {tokenBalance && tokenDecimals ? (
              <Amount value={tokenBalance} decimals={tokenDecimals} />
            ) : (
              0
            )}
          </span>
        </li>
        <li className="flex flex-col">
          <h5 className="font-bold text-fg/60">Mint</h5>
          <div className="flex justify-end items-end gap-4">
            <AmountInput
              maxName="Max"
              maxValue={parseUnits("9999999", tokenDecimals!)}
              decimals={tokenDecimals}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMintedAmount(parseUnits(e.target.value, tokenDecimals!))
              }
            />
            <TxButton size="medium" preparation={preparation}>
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

  const testClient = createTestClient({
    chain: hardhat,
    mode: "hardhat",
    transport: http(),
  });

  return (
    <AdminMasonry>
      <AdminBrick title="Underlying tokens">
        <p>
          When Ledgity DeFi is deployed locally or on a testnet, fake stablecoins contracts are also
          automatically deployed to mimic mainnets&apos; ones.
          <br />
          Here are those for the current test network:
        </p>
        {lTokens.map((lToken) => (
          <MintFakeToken key={lToken} contractId={lToken.slice(1) as ContractId} />
        ))}
      </AdminBrick>
      <AdminBrick title="LTY token">
        <p>
          When Ledgity DeFi is deployed locally or on a testnet, a fake $LTY token contract is also
          automatically deployed to mimic the mainnets one.
          <br />
          Here is the one for the current test network:
        </p>
        <MintFakeToken contractId="LTY" />
      </AdminBrick>
      <AdminBrick title="Increase block time">
        <div className="flex flex-col justify-center items-center gap-3">
          <p>
            Warning: When local chain timestamp is moved forward, the JS `Date.now()` is still at current
            timestamp. This may produce unwanted results if on-chain timestamps are for example compared
            to JS ones.
          </p>
          <Input
            type="number"
            placeholder="Number of days"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDayForwards(Number(e.target.value))}
          />
          <Button onClick={() => testClient.increaseTime({ seconds: dayForwards * 24 * 60 * 60 })}>
            Increase time
          </Button>
        </div>
      </AdminBrick>
      <AdminBrick title="Mint block">
        <Button
          onClick={() =>
            testClient.mine({
              blocks: 1,
            })
          }
        >
          Mint one block
        </Button>
      </AdminBrick>
    </AdminMasonry>
  );
};
