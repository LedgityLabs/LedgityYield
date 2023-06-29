import { Address, Amount, AmountInput, Card } from "@/components/ui";
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
import { LTokenId } from "../../../../../hardhat/deployments";
import { useAvailableLTokens } from "@/hooks/useAvailableLTokens";
import { TxButton } from "@/components/ui/TxButton";
import { useDApp } from "@/hooks";
import { parseUnits } from "viem";

const MintFakeUnderlying: FC<{ lTokenId: LTokenId }> = ({ lTokenId, ...props }) => {
  const { walletClient } = useDApp();
  const address = useContractAddress(lTokenId);
  const { data: underlyingAddress } = useLTokenUnderlying({ address: address });
  const { data: underlyingSymbol } = useGenericErc20Symbol({ address: underlyingAddress });
  const { data: underlyingName } = useGenericErc20Name({ address: underlyingAddress });
  const { data: underlyingDecimals } = useGenericErc20Decimals({
    address: underlyingAddress,
  });
  const { data: underlyingBalance } = useGenericErc20BalanceOf({
    address: underlyingAddress,
    args: [walletClient ? walletClient.account.address : "0x0"],
    watch: true,
  });
  const [mintedAmount, setMintedAmount] = useState(0n);
  const preparation = usePrepareGenericErc20Mint({
    address: underlyingAddress,
    args: [mintedAmount],
  });

  return (
    <div {...props} className="mt-8">
      <h4 className="text-lg font-semibold">{underlyingName}</h4>
      <ul className="pl-4 flex flex-col gap-2 py-2 list-disc">
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Address</h5>
          <Address address={underlyingAddress} copyable={true} addToWallet={true} tooltip={true} />
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Symbol</h5>
          <span>{underlyingSymbol}</span>
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Decimals</h5>
          <span>{underlyingDecimals}</span>
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Your balance</h5>
          <span>
            {underlyingBalance && underlyingDecimals ? (
              <Amount value={underlyingBalance} decimals={underlyingDecimals} />
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
              maxValue={parseUnits("9999999", underlyingDecimals!)}
              decimals={underlyingDecimals}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMintedAmount(parseUnits(e.target.value, underlyingDecimals!))
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

  return (
    <section className="grid grid-cols-[repeat(3,1fr)] grid-flow-row w-[1200px] gap-10 pb-10">
      <Card circleIntensity={0.07} className="p-8">
        <h3 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">
          Underlying tokens
        </h3>
        <p>
          When Ledgity DeFi is deployed locally or on a testnet, fake stablecoins contracts are also
          automatically deployed to mimic mainnets&apos; ones.
          <br />
          Here are those for the current test network:
        </p>
        {lTokens.map((lToken) => (
          <MintFakeUnderlying key={lToken} lTokenId={lToken} />
        ))}
      </Card>
    </section>
  );
};
