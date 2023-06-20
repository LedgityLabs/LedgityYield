import clsx from "clsx";
import { Poppins, Inter } from "next/font/google";

const headingFont = Poppins({
  weight: ["600", "700", "800"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-heading",
});
const bodyFont = Inter({
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

export const fonts = clsx(headingFont.variable, bodyFont.variable);
