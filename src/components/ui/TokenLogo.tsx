import { FC } from "react";
import Image, { type StaticImageData } from "next/image";
import iconDark from "~/assets/logo/iconDark.png";
import usdcTokenLogo from "~/assets/tokens/usdc.png";
import eurocTokenLogo from "~/assets/tokens/euroc.png";
import unknownTokenLogo from "~/assets/tokens/unknown.svg";

export const tokensLogos: Record<string, StaticImageData> = {
  USDC: usdcTokenLogo,
  EUROC: eurocTokenLogo,
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  symbol: string;
  size: number;
  wrapped?: boolean;
}

export const TokenLogo: FC<Props> = ({ symbol, size }) => {
  // If this is a unwrapped token symbol
  if (tokensLogos[symbol]) {
    return <Image src={tokensLogos[symbol]} alt={`${symbol} logo`} height={size} width={size} />;
  }

  // Or if this is a L-Token one
  else if (symbol.startsWith("L") && tokensLogos[symbol.slice(1)]) {
    return (
      <div className="relative">
        <Image src={tokensLogos[symbol.slice(1)]} alt={`${symbol} logo`} height={size} width={size} />
        <Image
          src={iconDark}
          alt="Ledgity icon dark"
          height={size / 1.5}
          className="absolute -left-[2px] top-[65%] transform -translate-y-1/2"
        />
      </div>
    );
  }

  // Of it is an unknown token
  else {
    return <Image src={unknownTokenLogo} alt="Unknown token logo" height={size} width={size} />;
  }
};
