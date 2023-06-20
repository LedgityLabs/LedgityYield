import { type NextPage } from "next";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { DApp } from "@/components/DApp";

interface Props {
  children: React.ReactNode;
}

export const metadata = {
  title: "App",
};

const AppLayout: NextPage<Props> = ({ children }) => {
  return (
    <>
      <DApp>
        <AppHeader />
        <main>{children}</main>
        <AppFooter />
      </DApp>
    </>
  );
};

export default AppLayout;
