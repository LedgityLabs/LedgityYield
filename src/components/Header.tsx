"use client";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "~/assets/logo/light.png";
import { Button } from "@/components/ui";
import { usePathname } from "next/navigation";

const Header: FC = () => {
  const path = usePathname();

  // TODO: Add "backdrop-blur-md" tailwind class to `<nav>` element when its 'y' position !== 0
  return (
    <header className="pb-[92px] relative">
      <nav className="fixed z-10 flex justify-between px-8 py-6 w-screen">
        <Link href="/" className="flex pt-1">
          <Image
            alt="Ledgity Logo"
            src={logo}
            className="h-9 w-auto cursor-pointer"
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
