import { type NextPage } from "next";
import HomeHero from "@/components/site/home/HomeHero";
import HomePartners from "@/components/site/home/HomePartners";
import HomeHowItWorks from "@/components/site/home/HomeHowItWorks";
import HomeFeatures from "@/components/site/home/HomeFeatures";

export const metadata = {
  title: "Stable Yield For Stablecoins",
};

//
const Page: NextPage = () => {
  return (
    <>
      <HomeHero className="fixed inset-0 h-[100vh] pt-[30px]" />
      <div className="relative top-[100vh] z-10 mb-[100vh] bg-[url('/assets/other-glow.webp')] bg-cover bg-[left_30%_top_30%] backdrop-blur-3xl md:bg-top">
        <HomeFeatures />
        <HomeHowItWorks />
        <HomePartners />
      </div>
    </>
  );
};
export default Page;
