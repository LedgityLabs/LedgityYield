"use client";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "~/assets/logo/light.png";
import { Button } from "@/components/ui";
import { usePathname } from "next/navigation";

const Header: FC = () => {
  const path = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const handleScroll = () => setScrollY(window.scrollY);

  useEffect(() => {
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  });

  return (
    <header className="pb-[92px] relative z-50">
      <nav
        className={
          "fixed flex justify-between px-8 py-6 w-screen " +
          (scrollY > 0 ? "backdrop-blur-md" : "")
        }
      >
        <Link href="/" className="flex pt-1">
          <Image
            alt="Ledgity Logo"
            src={logo}
            className="h-9 w-auto cursor-pointer"
            width={121}
          />
          <p className="-mt-0.5 ml-2 self-start rounded-sm bg-indigo-400 px-1.5 py-1 font-body text-[0.7rem] font-semibold leading-tight tracking-wide text-stone-100">
            DeFi
          </p>
        </Link>
        {!path.startsWith("/app") && (
          <Link href="/app">
            <Button size="large">Enter app</Button>
          </Link>
        )}
      </nav>
    </header>
  );
};
export default Header;
