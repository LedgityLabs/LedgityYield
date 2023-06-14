import "@/styles/globals.css";
import { type NextPage } from "next";
import Header from "@/components/Header";
import { CardsHelper } from "@/components/ui";
import Footer from "@/components/Footer";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Script from "next/script";
import { fonts } from "@/lib/fonts";

gsap.registerPlugin(ScrollTrigger);

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
        <body className={fonts}>
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
