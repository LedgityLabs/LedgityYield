import { type NextPage } from "next";
import HomeHero from "@/components/site/home/HomeHero";
import HomePartners from "@/components/site/home/HomePartners";
import HomeHowItWorks from "@/components/site/home/HomeHowItWorks";
import HomeFeatures from "@/components/site/home/HomeFeatures";
import HomeCTA from "@/components/site/home/HomeCTA";

export const metadata = {
  title: "Stable Yield For Stablecoins",
};

const Page: NextPage = () => {
  return (
    <>
      <HomeHero className="absolute top-0 left-0 right-0 h-screen bottom-" />
      <div className="relative bg-[url('/assets/other-glow.webp')] bg-cover md:bg-top bg-[left_30%_top_30%] md:top-[90vh] top-[100vh] md:pb-[90vh] pb-[100vh]">
        <HomeFeatures />
        <HomeHowItWorks />
        <HomeCTA />
        <HomePartners />
      </div>
    </>
  );
};
export default Page;
