import Image, { type StaticImageData } from "next/image";
//
import ldyTokenLogo from "~/assets/tokens/ldy.svg";
import lynxTokenLogo from "~/assets/tokens/lynx.svg";
import usdcTokenLogo from "~/assets/tokens/usdc.png";
import lusdcTokenLogo from "~/assets/tokens/lusdc.svg";
import leurcTokenLogo from "~/assets/tokens/leurc.svg";
import eurocTokenLogo from "~/assets/tokens/euroc.png";
import leurocTokenLogo from "~/assets/tokens/leuroc.png";
import lvcTokenLogo from "~/assets/tokens/lvc.png";
import hznTokenLogo from "~/assets/tokens/hzn.png";
import aaTokenLogo from "~/assets/tokens/aa.svg";
import unknownTokenLogo from "~/assets/tokens/unknown.svg";
import eurcTokenLogo from "~/assets/tokens/eurc.png";

export const tokensLogos: Record<string, StaticImageData> = {
  "EUROC": eurocTokenLogo,
  "LEUROC": leurocTokenLogo,
  "LYNX": lynxTokenLogo,
  "LVC": lvcTokenLogo,
  "HZN": hznTokenLogo,
  "AA": aaTokenLogo,
  //
  "LDY": ldyTokenLogo,
  "USDC": usdcTokenLogo,
  "EURC": eurcTokenLogo,
  "USDC.e": usdcTokenLogo,
  "EURC.e": eurcTokenLogo,
  "LUSDC": lusdcTokenLogo,
  "LEURC": leurcTokenLogo,
  "LUSDC.e": lusdcTokenLogo,
  "LEURC.e": leurcTokenLogo,
  "lyUSD": lusdcTokenLogo,
  "lyEUR": leurcTokenLogo,
};

export function TokenLogo({
  symbol,
  size,
  className,
}: {
  symbol: string;
  size: number;
  className?: string;
}) {
  // If this is a known token
  if (tokensLogos[symbol]) {
    return (
      <Image
        src={tokensLogos[symbol]}
        alt={`${symbol} logo`}
        height={size}
        width={size}
        className={className}
      />
    );
  }

  // Of it is an unknown token
  else {
    return (
      <Image
        src={unknownTokenLogo}
        alt="Unknown token logo"
        height={size}
        width={size}
        className={className}
      />
    );
  }
}
