import { hardhat } from "wagmi/chains";
// Components
import { AdminBrick } from "@/components/admin/AdminBrick";
import { AdminMasonry } from "@/components/admin/AdminMasonry";
import { MintTx } from "@/components/contracts";
import {
  AddressElement,
  Amount,
  AmountInput,
  Button,
  Input,
} from "@/components/ui";
// Hooks
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useBalanceOf } from "@/hooks/contracts";
import { useState } from "react";
// Functions
import { createTestClient, http, parseUnits } from "viem";

export function AdminTesting() {
  const { currentAccount } = useWeb3Context();
  const { tokenInfos } = useAppDataContext();

  const tokenData = tokenInfos.find((token) => token.symbol === "LDY");

  const [dayForwards, setDayForwards] = useState(0);
  const [mintedAmount, setMintedAmount] = useState("");

  const testClient = createTestClient({
    chain: hardhat,
    mode: "hardhat",
    transport: http(),
  });

  const ldyBalance = useBalanceOf(tokenData?.address, currentAccount);

  function handleSetMintAmount(e: React.ChangeEvent<HTMLInputElement>) {
    setMintedAmount(e.target.value);
  }

  function handleSetDaysForward(e: React.ChangeEvent<HTMLInputElement>) {
    setDayForwards(Number(e.target.value));
  }

  return (
    <AdminMasonry>
      <AdminBrick title="Underlying tokens">
        <p>
          When Ledgity Yield is deployed locally, fake stablecoins contracts are
          also automatically deployed to mimic mainnets&apos; ones.
          <br />
          <br />
          Here are those for the current local network:
        </p>
      </AdminBrick>

      <AdminBrick title="LDY token">
        <p>
          When Ledgity Yield is deployed locally, a fake $LDY token contract is
          also automatically deployed to mimic the mainnets&apos; ones.
          <br />
          <br />
          Here is the one for the local test network:
        </p>

        <div className="mt-8">
          <h4 className="text-lg font-semibold">{tokenData?.name}</h4>
          <ul className="pl-4 flex flex-col gap-2 py-2 list-disc">
            <li className="flex gap-3 items-center">
              <h5 className="font-bold text-fg/60">Address</h5>
              <AddressElement
                address={tokenData?.address}
                copyable={true}
                addToWallet={true}
                tooltip={true}
              />
            </li>
            <li className="flex gap-3 items-center">
              <h5 className="font-bold text-fg/60">Symbol</h5>
              <span>{tokenData?.symbol}</span>
            </li>
            <li className="flex gap-3 items-center">
              <h5 className="font-bold text-fg/60">Decimals</h5>
              <span>{tokenData?.decimals}</span>
            </li>
            <li className="flex gap-3 items-center">
              <h5 className="font-bold text-fg/60">Your balance</h5>
              <span>
                <Amount
                  value={ldyBalance}
                  decimals={tokenData?.decimals || 0}
                />
              </span>
            </li>
            <li className="flex flex-col">
              <h5 className="font-bold text-fg/60">Mint</h5>
              <div className="flex justify-end items-end gap-4">
                <AmountInput
                  maxName="Max"
                  maxValue={parseUnits("9999999", tokenData?.decimals!)}
                  decimals={tokenData?.decimals}
                  onChange={handleSetMintAmount}
                />
                <MintTx
                  buttonText="Mint"
                  tokenAddress={tokenData?.address}
                  params={{
                    amount: mintedAmount,
                    tokenDecimals: tokenData?.decimals || 0,
                  }}
                />
              </div>
            </li>
          </ul>
        </div>
      </AdminBrick>

      <AdminBrick title="Increase block time">
        <div className="flex flex-col justify-center items-center gap-3">
          <p>
            Warning: When local chain timestamp is moved forward, the JS
            `Date.now()` is still at current timestamp. This may produce
            unwanted results if on-chain timestamps are for example compared to
            JS ones.
          </p>
          <Input
            type="number"
            placeholder="Number of days"
            onChange={handleSetDaysForward}
          />
          <Button
            onClick={() =>
              testClient.increaseTime({ seconds: dayForwards * 24 * 60 * 60 })
            }
          >
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
}
