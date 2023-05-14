import "@/styles/globals.css";
import { Poppins, Inter } from "next/font/google";
import { type NextPage } from "next";
import Head from "next/head";
import Header from "@/components/Header";

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
  title: "Ledgity - DeFi Protocol",
  description:
    "Invest stablecoins into real world assets and earn up to 7% APY. Access low-risk & stable yield offered by real world asset directly from your wallet.",
};

interface Props {
  children: React.ReactNode;
}

const RootLayout: NextPage<Props> = ({ children }) => {
  return (
    <>
      <html lang="en">
        <Head>
          <title>Ledgity - DeFi Protocol</title>
          <meta
            name="description"
            content="DeFi Protocol where you can lend USDC and start earning yield. Ledgity's stable yield comes from the best risk adjusted return opportunities from DeFi, CeFi and Real World Assets."
          />
          <link rel="icon" href="/assets/favicon/32x32.png" />
        </Head>
        <body className={`${inter.variable} ${poppins.variable}`}>
          <Header />
          <main>{children}</main>
          <footer></footer>
        </body>
      </html>
    </>
  );
};

export default RootLayout;
