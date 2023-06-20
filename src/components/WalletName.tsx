import Image from "next/image";
import { FC } from "react";
import { useEnsName } from "wagmi";

interface Props {
  address: `0x${string}` | undefined;
}

export const WalletName: FC<Props> = ({ address }) => {
  let name: string | undefined;
  const { data: ensName } = useEnsName({ address: address, chainId: 1 });
  if (ensName) name = ensName.length > 20 ? ensName.slice(0, 20) + "..." : ensName;
  else if (address) name = name = address.slice(0, 5) + "..." + address.slice(-4);
  return <span>{name}</span>;
};
