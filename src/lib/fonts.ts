import clsx from "clsx";
import { Poppins, Inter } from "next/font/google";

const poppins = Poppins({
  weight: ["600", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});
const inter = Inter({
  weight: ["300", "400", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const fonts = clsx(poppins.variable, inter.variable);
