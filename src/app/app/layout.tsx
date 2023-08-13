import "@rainbow-me/rainbowkit/styles.css";

import { type NextPage } from "next";
import AppHeader from "@/components/app/AppHeader";

interface Props {
  children: React.ReactNode;
}

export const metadata = {
  title: "App",
};

const AppLayout: NextPage<Props> = ({ children }) => {
  // Force DApp to be loaded dynamically without SSR
  return (
    <>
      <AppHeader />
      <main>{children}</main>
    </>
  );
};

export default AppLayout;
