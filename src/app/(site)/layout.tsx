import { type NextPage } from "next";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Script from "next/script";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  children: React.ReactNode;
}

const SiteLayout: NextPage<Props> = ({ children }) => {
  return (
    <>
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
      <Script src="//embed.typeform.com/next/embed.js" defer async></Script>
    </>
  );
};

export default SiteLayout;
