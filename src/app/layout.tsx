import "@/styles/globals.css";
import { Poppins, Inter } from "next/font/google";
import { type NextPage } from "next";
import Header from "@/components/Header";
import { CardsHelper } from "@/components/ui";
import Footer from "@/components/Footer";
import clsx from "clsx";
import Script from "next/script";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["italic", "normal"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-poppins",
});
const inter = Inter({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata = {
  title: "Ledgity DeFi | Stable Yield For Stablecoins",
  description:
    "Earn up to 7% APY on your stablecoins backed by Real World Assets (RWA). Access low-risk & stable yield directly from your wallet.",
};

interface Props {
  children: React.ReactNode;
}

const RootLayout: NextPage<Props> = ({ children }) => {
  return (
    <>
      <html lang="en">
        <CardsHelper />
        <body className={clsx(`${inter.variable} ${poppins.variable}`, "w-screen overflow-x-hidden")}>
          <Header />
          <main>{children}</main>
          <Footer />
          <Script src="//embed.typeform.com/next/embed.js"></Script>
        </body>
      </html>
    </>
  );
};

export default RootLayout;
