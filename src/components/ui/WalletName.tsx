import { FC } from "react";
import { useEnsName } from "wagmi";
import { Address } from "./Address";

interface Props {
  address: `0x${string}`;
}

export const WalletName: FC<Props> = ({ address }) => {
  const { data: ensName } = useEnsName({ address: address, chainId: 1 });
  if (ensName) {
    const formattedName =
      ensName.length > 20 ? ensName.slice(0, 20) + "..." : ensName;
    return <span>{formattedName}</span>;
  } else return <Address address={address} />;
};
