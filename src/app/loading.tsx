"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import logoIconDark from "~/assets/logo/iconDark.png";
import clsx from "clsx";
import { Spinner } from "@/components/ui";

const Page = () => {
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    setOpacity(1);
    return () => setOpacity(0);
  }, []);
  return (
    <main
      className={clsx(
        "relative z-[100] flex flex-col justify-end items-center gap-3 pb-6 w-screen h-screen bg-gradient-to-tr from-bg to-accent transition-opacity duration-1000"
      )}
      style={{
        opacity: opacity,
      }}
    >
      <Image
        src={logoIconDark}
        alt="loader logo"
        width={45}
        className="animate-pulse duration-[2000ms]"
      />
      <Spinner />
    </main>
  );
};

export default Page;
