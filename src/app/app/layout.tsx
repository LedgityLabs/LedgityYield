import { type NextPage } from "next";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { LazyDApp } from "@/components/LazyDApp";

interface Props {
  children: React.ReactNode;
}

export const metadata = {
  title: "App",
};

const AppLayout: NextPage<Props> = async ({ children }) => {
  return (
    <LazyDApp>
      <AppHeader />
      <main>{children}</main>
      <AppFooter />
    </LazyDApp>
  );
};

export default AppLayout;
