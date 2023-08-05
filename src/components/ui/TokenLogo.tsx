import { FC } from "react";
import Image, { type StaticImageData } from "next/image";
import usdcTokenLogo from "~/assets/tokens/usdc.png";
import lusdcTokenLogo from "~/assets/tokens/lusdc.png";
import eurocTokenLogo from "~/assets/tokens/euroc.png";
import leurocTokenLogo from "~/assets/tokens/leuroc.png";
import unknownTokenLogo from "~/assets/tokens/unknown.svg";

export const tokensLogos: Record<string, StaticImageData> = {
  USDC: usdcTokenLogo,
  EUROC: eurocTokenLogo,
  LEUROC: leurocTokenLogo,
  LUSDC: lusdcTokenLogo,
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  symbol: string;
  size: number;
  wrapped?: boolean;
}

export const TokenLogo: FC<Props> = ({ symbol, size }) => {
  // If this is a known token
  if (tokensLogos[symbol]) {
    return <Image src={tokensLogos[symbol]} alt={`${symbol} logo`} height={size} width={size} />;
  }

  // Of it is an unknown token
  else {
    return <Image src={unknownTokenLogo} alt="Unknown token logo" height={size} width={size} />;
  }
};
