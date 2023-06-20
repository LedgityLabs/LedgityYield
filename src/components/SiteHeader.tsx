"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import Logo from "./Logo";
import { twMerge } from "tailwind-merge";

const SiteHeader: FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const handleScroll = () => setScrollY(window.scrollY);
  useEffect(() => {
    handleScroll();
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  });

  return (
    <header className="pb-[92px] relative z-50">
      <nav
        className={twMerge(
          "fixed flex items-center px-8 py-6 w-screen sm:backdrop-blur-md sm:justify-between justify-center",
          scrollY > 0 && "backdrop-blur-md"
        )}
      >
        <Logo />
        <div className="flex gap-6">
          <Button
            data-tf-popup="J2ENFK9t"
            data-tf-opacity="100"
            data-tf-size="100"
            data-tf-iframe-props="title=Subscribe to app release"
            data-tf-transitive-search-params
            data-tf-medium="snippet"
            size="large"
            className="sm:block hidden"
          >
            Enter app
          </Button>
          <Button className="flex justify-center items-center font-bold w-12" variant="outline">
            <i className="ri-more-2-fill text-2xl "></i>
          </Button>
        </div>
      </nav>
    </header>
  );
};
export default SiteHeader;
