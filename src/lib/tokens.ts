import usdcTokenLogo from "~/assets/tokens/usdc.png";
import eurocTokenLogo from "~/assets/tokens/euroc.png";

export const tokens = {
  USDC: {
    logo: usdcTokenLogo,
  },
  EUROC: {
    logo: eurocTokenLogo,
  },
};

export type TokenSymbol = keyof typeof tokens;
