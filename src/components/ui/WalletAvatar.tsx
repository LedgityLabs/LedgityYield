import Image from "next/image";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import { useEnsAvatar, useEnsName } from "wagmi";

function addressToGradient(address: string) {
  const start = "#" + address.substring(2, 8);
  const end = "#" + address.substring(address.length - 6);
  return "linear-gradient(135deg, " + start + ", " + end + ")";
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  address: `0x${string}`;
  size: number;
}

export const WalletAvatar: FC<Props> = ({ className, address, size, ...props }) => {
  const { data: ensName } = useEnsName({ address: address, chainId: 1 });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName as string | undefined,
    chainId: 1,
  });
  return (
    <div className={twMerge("overflow-hidden w-full h-full", className)} {...props}>
      {ensAvatar ? (
        <Image
          className="h-full aspect-square w-auto"
          src={ensAvatar}
          width={size}
          height={size}
          alt="profile avatar"
        />
      ) : (
        <div
          className="h-full aspect-square"
          style={{
            background: addressToGradient(address),
          }}
          {...props}
        ></div>
      )}
    </div>
  );
};
