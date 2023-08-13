import "@/styles/globals.css";
import "remixicon/fonts/remixicon.css";
import { type NextPage } from "next";
import { CardsHelper, TooltipProvider } from "@/components/ui";
import { fonts } from "@/lib/fonts";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Loader from "@/app/loading";

const name = "Ledgity Yield";
const description =
  "Earn up to 7% APY on your stablecoins backed by Real World Assets (RWA). Access low-risk & stable yield directly from your wallet.";
export const metadata = {
  metadataBase: new URL("https://ledgity.finance"),
  applicationName: name,
  title: {
    template: `${name} • %s`,
    default: "Untitled Page",
  },
  colorScheme: "light",
  themeColor: "rgb(var(--bg))",
  description: description,
  keywords: ["stablecoins", "yield", "DeFi", "crypto", "RWA", "real world assets", "CeFi"],
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
    site: "@LedgityYield",
    creator: "@LedgityYield",
    title: `${name} | Stable Yield For Stablecoins`,
    description: description,
  },
  manifest: "https://ledgity.finance/manifest.json",
  verification: {
    google: "Gy_ommY7mtAUwTSdS8bNsHmmMeeKSmPAy8H5lEhX738",
  },
};

interface Props {
  children: React.ReactNode;
}

const RootLayout: NextPage<Props> = ({ children }) => {
  const DApp = dynamic(() => import("@/components/app/DApp"), { loading: Loader, ssr: false });

  return (
    <html lang="en">
      <body
        className={clsx(
          fonts,
          "min-h-screen",
          "after:pointer-events-none after:absolute after:inset-0 after:z-[1000000] after:bg-[url(/assets/noise.png)] after:opacity-[0.07] after:bg-blend-difference after:contrast-200",
        )}
      >
        <CardsHelper />
        <TooltipProvider delayDuration={400}>
          <DApp>
            <div className="max-w-screen relative overflow-x-hidden overflow-y-hidden">
              {children}
            </div>
          </DApp>
        </TooltipProvider>
      </body>
    </html>
  );
};

export default RootLayout;
