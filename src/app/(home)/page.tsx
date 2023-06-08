import { type NextPage } from "next";
import HomeHero from "@/components/HomeHero";
import HomePartners from "@/components/HomePartners";
import HomeHowItWorks from "@/components/HomeHowItWorks";
import HomeFeatures from "@/components/HomeFeatures";
import HomeCTA from "@/components/HomeCTA";

const Page: NextPage = () => {
  return (
    <>
      <HomeHero />
      <div className="relative bg-[url('/assets/other-glow.webp')] bg-cover md:bg-top bg-[left_30%_top_30%] -mt-[30vh]">
        <HomeFeatures />
        <HomeHowItWorks />
        <HomeCTA />
        <HomePartners />
      </div>
    </>
  );
};
export default Page;
