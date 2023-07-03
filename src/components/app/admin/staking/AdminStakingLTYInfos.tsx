import { Address, Amount, Card } from "@/components/ui";
import {
  useGenericErc20BalanceOf,
  useGenericErc20Decimals,
  useGenericErc20Name,
  useGenericErc20Symbol,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { useWalletClient } from "wagmi";
import { AdminBrick } from "../AdminBrick";

export const AdminStakingLTYInfos: FC<React.ComponentPropsWithRef<typeof Card>> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const ltyAddress = useContractAddress("LTY");
  const { data: ltyName } = useGenericErc20Name({
    address: ltyAddress,
  });
  const { data: ltySymbol } = useGenericErc20Symbol({
    address: ltyAddress,
  });
  const { data: ltyDecimals } = useGenericErc20Decimals({
    address: ltyAddress,
  });
  const { data: ltyBalance } = useGenericErc20BalanceOf({
    address: ltyAddress,
    args: [walletClient ? walletClient.account.address : "0x0"],
    watch: true,
  });

  return (
    <AdminBrick title="$LTY infos">
      <ul className="pl-4 flex flex-col gap-2 list-disc">
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
    </AdminBrick>
  );
};
