"use client";
import { FC } from "react";
import Logo from "@/components/ui/Logo";
import { ConnectButton } from "@/components/app/ConnectButton";
import { DotsMenu } from "./DotsMenu";
import Link from "next/link";
import { Button } from "./ui";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

const EnterAppButton = () => {
  return (
    <Link href="/app/invest">
      <Button size="large" className="relative hidden sm:block overflow-visible">
        Enter app
        <span className="absolute px-1 py-1 text-[0.71rem] leading-none rounded-md text-bg -top-0.5 -right-0.5 bg-orange-700">
          Beta
        </span>
      </Button>
    </Link>
  );
};
const Header: FC = () => {
  const pathname = usePathname();
  const isAppOrAdmin = pathname.startsWith("/app") || pathname.startsWith("/admin");
  return (
    <header className="relative z-50 pb-[97px]">
      <nav className="fixed flex w-screen items-center justify-between px-6 py-6 backdrop-blur-md">
        <Logo className={twMerge("ml-2", isAppOrAdmin && "hidden md:flex")} />
        <Logo className={twMerge("ml-2 hidden", isAppOrAdmin && "flex md:hidden")} noText={true} />

        <Link href="/app/mail" className="text-white hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </Link>

        <div className="flex sm:gap-6 gap-3 justify-end">
          {isAppOrAdmin ? <ConnectButton /> : <EnterAppButton />}
          <DotsMenu />
        </div>
      </nav>
    </header>
  );
};
export default Header;
