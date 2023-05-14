import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "~/assets/logo/light.png";
import { Button } from "@/components/ui";

const Header: FC = () => (
  <header className="pb-[92px] relative">
    <nav className="fixed z-10 flex justify-between px-8 py-6 backdrop-blur-md w-screen">
      <Link href="/" className="flex pt-1">
        <Image
          alt="Ledgity Logo"
          src={logo}
          className="h-9 w-auto cursor-pointer"
        />
        <p className="-mt-0.5 ml-2 self-start rounded-md bg-sky-600/80 px-1.5 py-1 font-body text-[0.7rem] font-semibold leading-tight tracking-wide text-stone-100">
          DeFi
        </p>
      </Link>
      <Link href="/app">
        <Button size="large">Enter app</Button>
      </Link>
    </nav>
  </header>
);
export default Header;
