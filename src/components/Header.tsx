"use client";
import { FC } from "react";
import Logo from "@/components/ui/Logo";
import { ConnectButton } from "@/components/app/ConnectButton";
import { DotsMenu } from "./DotsMenu";
import Link from "next/link";
import { Button } from "./ui";
import { usePathname } from "next/navigation";

const EnterAppButton = () => {
  return (
    <Link href="/app">
      <Button size="large" className="hidden sm:block">
        Enter app
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
        {isAppOrAdmin ? (
          <>
            <Logo className="ml-2 hidden md:flex" />
            <Logo className="ml-2 flex md:hidden" noText={true} />
          </>
        ) : (
          <Logo className="ml-2" />
        )}

        <div className="flex gap-6">
          {isAppOrAdmin ? <ConnectButton /> : <EnterAppButton />}
          <DotsMenu />
        </div>
      </nav>
    </header>
  );
};
export default Header;
