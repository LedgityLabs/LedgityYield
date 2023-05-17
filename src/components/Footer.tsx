"use client";
import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "~/assets/logo/dark.png";

const Footer: FC = () => {
  return (
    <footer className="bg-fg p-12 flex justify-center items-center">
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
    </footer>
  );
};
export default Footer;
