"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui";
import Logo from "@/components/ui/Logo";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { DotsMenu } from "../DotsMenu";

const SiteHeader: FC = () => {
  return (
    <header className="relative z-50 pb-[97px]">
      <nav
        className={twMerge(
          "fixed flex w-screen items-center justify-between px-6 py-6 backdrop-blur-md",
        )}
      >
        <Logo className="ml-2" />
        <div className="static flex gap-6">
          <Link href="/app">
            <Button size="large" className="hidden sm:block">
              Enter app
            </Button>
          </Link>

          <DotsMenu className="sm:static" />
        </div>
      </nav>
    </header>
  );
};
export default SiteHeader;
