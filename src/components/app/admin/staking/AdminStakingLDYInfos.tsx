import { Address, Amount, Card } from "@/components/ui";
import {
  useGenericErc20BalanceOf,
  useGenericErc20Decimals,
  useGenericErc20Name,
  useGenericErc20Symbol,
} from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { FC } from "react";
import { useWalletClient } from "wagmi";
import { AdminBrick } from "../AdminBrick";

export const AdminStakingLDYInfos: FC<React.ComponentPropsWithRef<typeof Card>> = ({ className }) => {
  const { data: walletClient } = useWalletClient();
  const ldyAddress = useContractAddress("LDY");
  const { data: ldyName } = useGenericErc20Name({
    address: ldyAddress,
  });
  const { data: ldySymbol } = useGenericErc20Symbol({
    address: ldyAddress,
  });
  const { data: ldyDecimals } = useGenericErc20Decimals({
    address: ldyAddress,
  });
  const { data: ldyBalance } = useGenericErc20BalanceOf({
    address: ldyAddress,
    args: [walletClient ? walletClient.account.address : "0x0"],
    watch: true,
  });

  return (
    <AdminBrick title="$LDY infos">
      <ul className="pl-4 flex flex-col gap-2 list-disc">
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Address</h5>
          <Address address={ldyAddress} copyable={true} addToWallet={true} tooltip={true} />
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Name</h5>
          <span>{ldyName}</span>
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Symbol</h5>
          <span>{ldySymbol}</span>
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Decimals</h5>
          <span>{ldyDecimals}</span>
        </li>
        <li className="flex gap-3 items-center">
          <h5 className="font-bold text-fg/60">Your balance</h5>
          <span>
            {ldyBalance && ldyDecimals ? <Amount value={ldyBalance} decimals={ldyDecimals} /> : 0}
          </span>
        </li>
      </ul>
    </AdminBrick>
  );
};
