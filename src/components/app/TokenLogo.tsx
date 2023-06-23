import { TokenSymbol, tokens } from "@/lib/tokens";
import Image from "next/image";
import { FC } from "react";
import iconDark from "~/assets/logo/iconDark.png";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  symbol: TokenSymbol;
  size: number;
  wrapped?: boolean;
}

export const TokenLogo: FC<Props> = ({ symbol, size, wrapped = false }) => {
  return (
    <div className="relative">
      <Image src={tokens[symbol].logo} alt={`${symbol} logo`} height={size} width={size} />
      {wrapped && (
        <Image
          src={iconDark}
          alt="Ledgity icon dark"
          height={size / 1.5}
          className="absolute bottom-0 right-0"
        />
      )}
    </div>
  );
};
