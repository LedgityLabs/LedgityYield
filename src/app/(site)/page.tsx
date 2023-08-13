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
      <div className="relative top-[100vh] z-10 overflow-hidden border-t-2 border-t-primary/10 bg-[url('/assets/textures/other-glow.webp')] bg-cover bg-[left_30%_top_30%] pb-[100vh] pt-16 shadow-2xl shadow-primary/50 backdrop-blur-3xl [border-radius:53%_47%_0%_0%/1%_1%_100%_100%] md:bg-top md:[border-radius:53%_47%_0%_0%/3%_3%_100%_100%]">
        <HomeFeatures />
        <HomeHowItWorks />
        <HomePartners />
      </div>
    </>
  );
};
export default Page;
