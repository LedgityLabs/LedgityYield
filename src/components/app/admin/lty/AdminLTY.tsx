import { Address, Amount, AmountInput, Card } from "@/components/ui";
import {
  useLtyDecimals,
  useLtyBalanceOf,
  usePrepareLtyMint,
  useLtySymbol,
  useLtyName,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { TxButton } from "@/components/ui/TxButton";
import { parseUnits } from "viem";
import { useWalletClient } from "wagmi";
export const AdminLTY: FC = () => {
  const { data: walletClient } = useWalletClient();
  const ltyAddress = useContractAddress("LTY");
  const { data: ltyName } = useLtyName();
  const { data: ltySymbol } = useLtySymbol();
  const { data: ltyDecimals } = useLtyDecimals();
  const { data: ltyBalance } = useLtyBalanceOf({
    args: [walletClient ? walletClient.account.address : "0x0"],
    watch: true,
  });

  const [mintedAmount, setMintedAmount] = useState(0n);
  const preparation = usePrepareLtyMint({
    args: [mintedAmount],
  });

  return (
    <section className="grid grid-cols-[repeat(3,1fr)] grid-flow-row w-[1200px] gap-10 pb-10">
      <Card circleIntensity={0.07} className="p-8">
        <h3 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">Tokens infos</h3>
        <ul className="pl-4 flex flex-col gap-2 py-2 list-disc">
          <li className="flex gap-3 items-center">
            <h5 className="font-bold text-fg/60">Address</h5>
            <Address address={ltyAddress} copyable={true} addToWallet={true} tooltip={true} />
          </li>
          <li className="flex gap-3 items-center">
            <h5 className="font-bold text-fg/60">Name</h5>
            <span>{ltyName}</span>
          </li>
          <li className="flex gap-3 items-center">
            <h5 className="font-bold text-fg/60">Symbol</h5>
            <span>{ltySymbol}</span>
          </li>
          <li className="flex gap-3 items-center">
            <h5 className="font-bold text-fg/60">Decimals</h5>
            <span>{ltyDecimals}</span>
          </li>
          <li className="flex gap-3 items-center">
            <h5 className="font-bold text-fg/60">Your balance</h5>
            <span>
              {ltyBalance && ltyDecimals ? <Amount value={ltyBalance} decimals={ltyDecimals} /> : 0}
            </span>
          </li>
        </ul>
      </Card>
      <Card circleIntensity={0.07} className="p-8 flex flex-col justify-between">
        <h3 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">Mint LTY</h3>
        <div className="flex flex-col">
          <div className="flex justify-end items-end gap-4">
            <AmountInput
              maxName="Max"
              maxValue={parseUnits("9999999", ltyDecimals!)}
              decimals={ltyDecimals}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setMintedAmount(parseUnits(e.target.value, ltyDecimals!))
              }
            />
            <TxButton size="medium" preparation={preparation}>
              Mint
            </TxButton>
          </div>
        </div>
      </Card>
    </section>
  );
};
