import "@/styles/globals.css";
import { Poppins, Inter } from "next/font/google";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import logo from "~/assets/logo/light.png";
import { Button } from "@/components/ui/button";

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
          <header className="fixed z-10 w-screen">
            <nav className="flex justify-between px-8 py-6 backdrop-blur-md">
              <Link href="/" className="flex">
                <Image
                  alt="Ledgity Logo"
                  src={logo}
                  className="h-9 w-auto cursor-pointer"
                />
                <p className="-mt-0.5 ml-2 self-start rounded-md bg-sky-600/80 px-1.5 py-1 font-body text-[0.7rem] font-semibold leading-tight tracking-wide text-stone-100">
                  DeFi
                </p>
              </Link>
              <Link href="/app">
                <Button size="large">Enter app</Button>
              </Link>
            </nav>
          </header>
          <main className="pt-8">{children}</main>
          <footer></footer>
        </body>
      </html>
    </>
  );
};

export default RootLayout;
