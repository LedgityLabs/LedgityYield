import "@/styles/globals.css";
import { Poppins, Inter } from "next/font/google";
import { type NextPage } from "next";
import Header from "@/components/Header";
import { CardsHelper } from "@/components/ui";
import Footer from "@/components/Footer";
import clsx from "clsx";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Script from "next/script";

gsap.registerPlugin(ScrollTrigger);

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

const name = "Ledgity DeFi";
const description =
  "Earn up to 7% APY on your stablecoins backed by Real World Assets (RWA). Access low-risk & stable yield directly from your wallet.";
export const metadata = {
  applicationName: name,
  referrer: "origin",
  title: {
    template: `${name} | %s`,
    default: "Untitled Page",
  },
  colorScheme: "light",
  themeColor: "rgb(var(--bg))",
  description: description,
  keywords: ["stablecoins", "yield", "DeFi", "crypto", "rwa", "real world assets"],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  openGraph: {
    title: `${name} | Stable Yield For Stablecoins`,
    description: description,
    siteName: name,
    locale: "en_US",
    type: "website",
    url: "https://ledgity.finance",
  },
  twitter: {
    card: "summary_large_image",
    site: "@LedgityPlatform",
    creator: "@LedgityPlatform",
    title: `${name} | Stable Yield For Stablecoins`,
    description: description,
  },
  verification: {
    google: "Gy_ommY7mtAUwTSdS8bNsHmmMeeKSmPAy8H5lEhX738",
  },
};

interface Props {
  children: React.ReactNode;
}

const RootLayout: NextPage<Props> = ({ children }) => {
  return (
    <>
      <html lang="en">
        <CardsHelper />
        <body className={clsx(`${inter.variable} ${poppins.variable}`, "")}>
          <div className="relative max-w-screen overflow-x-hidden overflow-y-hidden">
            <Header />
            <main>{children}</main>
            <Footer />
            <Script src="//embed.typeform.com/next/embed.js" defer async></Script>
          </div>
        </body>
      </html>
    </>
  );
};

export default RootLayout;
