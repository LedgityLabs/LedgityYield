"use client";
import { useEffect, useState } from "react";
import { type NextPage } from "next";
import Image from "next/image";
import logoIconDark from "~/assets/logo/iconDark.png";
import clsx from "clsx";

const Page: NextPage = () => {
  // const [fadeOut, setFadeOut] = useState(false);
  // useEffect(() => {
  //   setFadeOut(false);
  //   return () => {
  //     setFadeOut(true);
  //     setTimeout(() => {}, 5000);
  //   };
  // }, []);
  // return null;
  const [opacity, setOpacity] = useState(0);
  useEffect(() => {
    setOpacity(1);
    return () => {
      setOpacity(0);
    };
  }, []);
  return (
    <main
      className={clsx(
        "relative z-[100] flex flex-col justify-end items-center gap-3 pb-6 w-screen h-screen bg-gradient-to-tr from-bg to-accent transition-opacity duration-[2000ms] "
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
      <i className="ri-loader-4-line animate-spin text-xl"></i>
    </main>
  );
};

export default Page;
