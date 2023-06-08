import { type NextPage } from "next";
import HomeHero from "@/components/HomeHero";
import HomePartners from "@/components/HomePartners";
import HomeHowItWorks from "@/components/HomeHowItWorks";
import HomeFeatures from "@/components/HomeFeatures";
import HomeCTA from "@/components/HomeCTA";

const Page: NextPage = () => {
  return (
    <>
      <HomeHero className="absolute top-0 left-0 right-0 h-screen bottom-" />
      <div className="relative bg-[url('/assets/other-glow.webp')] bg-cover md:bg-top bg-[left_10%_top_30%] top-[100vh] pb-[100vh]">
        <HomeFeatures />
        <HomeHowItWorks />
        <HomeCTA />
        <HomePartners />
      </div>
    </>
  );
};
export default Page;
