import { type NextPage } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

interface Props {
  children: React.ReactNode;
}

const SiteLayout: NextPage<Props> = ({ children }) => {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter className="relative z-50" />
    </>
  );
};

export default SiteLayout;
