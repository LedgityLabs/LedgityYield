import "@rainbow-me/rainbowkit/styles.css";

import { type NextPage } from "next";
import AppHeader from "@/components/app/AppHeader";
import dynamic from "next/dynamic";
import Loader from "@/app/loading";

interface Props {
  children: React.ReactNode;
}

export const metadata = {
  title: "App",
};

const AppLayout: NextPage<Props> = ({ children }) => {
  // Force DApp to be loaded dynamically without SSR
  const DApp = dynamic(() => import("@/components/app/DApp"), { loading: Loader, ssr: false });
  return (
    <DApp>
      <AppHeader />
      <main>{children}</main>
    </DApp>
  );
};

export default AppLayout;
