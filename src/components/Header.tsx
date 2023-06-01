"use client";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import Logo from "./Logo";

const Header: FC = () => {
  const path = usePathname();
  const [scrollY, setScrollY] = useState(0);
  const handleScroll = () => setScrollY(window.scrollY);

  useEffect(() => {
    handleScroll();
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  });

  return (
    <header className="pb-[92px] relative z-50">
      <nav
        className={clsx(
          "fixed flex sm:justify-between justify-center items-center px-8 py-6 w-screen",
          scrollY > 0 && "backdrop-blur-md"
        )}
      >
        <Logo />

        {!path.startsWith("/app") && (
          <Link href="/app" className="sm:block hidden">
            <Button size="large">Enter app</Button>
          </Link>
        )}
      </nav>
    </header>
  );
};
export default Header;
