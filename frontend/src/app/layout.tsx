import "@/styles/globals.css";
import "remixicon/fonts/remixicon.css";
import "@rainbow-me/rainbowkit/styles.css";

import { type NextPage } from "next";
import { CardsHelper, TooltipProvider } from "@/components/ui";
import { fonts } from "@/lib/fonts";
import clsx from "clsx";
import dynamic from "next/dynamic";
import Loader from "@/app/loading";
import Header from "@/components/Header";
import Script from "next/script";
import { Toaster } from "@/components/ui/Toaster";
import ClientOnly from "@/components/ClientOnly";

// Move DApp import outside of component
const DApp = dynamic(() => import("@/components/DApp"), { 
  loading: Loader,
  ssr: false,
});

interface Props {
  children: React.ReactNode;
}

const RootLayout: NextPage<Props> = ({ children }) => {
  return (
    <html lang="en">
      <body
        className={clsx(
          fonts,
          "min-h-screen",
          "after:pointer-events-none after:absolute after:inset-0 after:z-[1000000] after:bg-[url(/assets/textures/noise.png)] after:opacity-[0.02] after:bg-blend-difference after:contrast-200",
          "before:absolute before:inset-0 before:bg-[url('/assets/textures/other-glow.webp')] before:bg-cover before:opacity-50",
        )}
      >
        <ClientOnly>
          <DApp>
            <CardsHelper />
            <TooltipProvider delayDuration={400}>
              <div className="max-w-screen relative overflow-x-hidden overflow-y-hidden">
                <Header />
                <main>
                  {children}
                  <Toaster />
                </main>
              </div>
            </TooltipProvider>
          </DApp>
        </ClientOnly>

        {/* Google Analytics Scripts */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-90LEKEYYXG" />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-90LEKEYYXG');
        `}
        </Script>
      </body>
    </html>
  );
};

export default RootLayout;