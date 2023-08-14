"use client";
import { useEffect, useState } from "react";
import Logo from "./ui/Logo";

export const SmallScreenMessage = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const handleResize = () => {
    if (window.innerWidth < 1024) setIsSmallScreen(true);
    else setIsSmallScreen(false);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isSmallScreen)
    return (
      <div className="fixed inset-0 z-[1000000000000] flex flex-col items-center justify-center gap-8 bg-bg px-10 text-center text-lg font-semibold text-fg">
        <Logo />
        <p>The Ledgity Yield app is currently not available on small screens.</p>
        <p className="text-primary">Please access it from a computer.</p>
      </div>
    );
  return null;
};
