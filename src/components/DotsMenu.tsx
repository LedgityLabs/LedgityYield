"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { FC, useEffect, useRef, useState } from "react";
import { Button, Card } from "./ui";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { NetworkStatus } from "./app/NetworkStatus";
import { version } from "../../package.json";
import { useBlockNumber } from "wagmi";
import { usePathname } from "next/navigation";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {}

export const DotsMenu: FC<Props> = ({ className }) => {
  const pathname = usePathname();
  const [adminKeyPressCount, setAdminKeyPressCount] = useState(0);
  const [isAdminVisible, setIsAdminVisible] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isAdminVisible) {
      if (event.key === "Control" || event.key === "Meta") {
        const newPressCount = adminKeyPressCount + 1;
        if (newPressCount < 10) setAdminKeyPressCount(newPressCount);
        else {
          setAdminKeyPressCount(0);
          setIsAdminVisible(true);
          setTimeout(() => {
            setIsAdminVisible(false);
          }, 3000);
        }
      }
    }
  };

  // Listen to keydown events and increment the counter
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAdminVisible, adminKeyPressCount]);

  // // Display the admin button if the counter is greater than 10
  // useEffect(() => {
  //   if (adminKeyPressCount >= 10) {
  //     setIsAdminVisible(true);
  //     // Reset the counter
  //     setAdminKeyPressCount(0);

  //     // Hide the component after 5 seconds
  //     const timerId = setTimeout(() => {
  //       if (isAdminVisible) {
  //         // Check if it's still visible before setting it to false
  //         setIsAdminVisible(false);
  //       }
  //     }, 5000);

  //     return () => {
  //       clearTimeout(timerId);
  //     };
  //   }
  // }, [adminKeyPressCount]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={twMerge("flex justify-center items-center font-bold w-12", className)}
          variant="outline"
        >
          <i className="ri-more-2-fill text-2xl "></i>
        </Button>
      </PopoverTrigger>
      <PopoverContent collisionPadding={20} sideOffset={10}>
        <Card className="p-10 pb-8 flex flex-col gap-14 backdrop drop-shadow-lg">
          <ul className="flex flex-col gap-3 text-lg font-semibold">
            <li>
              <Link href="/" className="hover:opacity-80">
                Documentation&nbsp;
                <i className="ri-external-link-fill" />
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className="opacity-40 inline-flex items-center justify-center cursor-not-allowed"
                aria-disabled
              >
                Whitepaper&nbsp;
                <i className="ri-external-link-fill" />
                <span className="inline-block bg-fg/80 text-bg ml-3 px-2 py-0.5 rounded-full text-xs">
                  coming soon
                </span>
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:opacity-80">
                Support&nbsp;
                <i className="ri-external-link-fill" />
              </Link>
            </li>
            {isAdminVisible && (
              <li>
                <Link href="/app/admin" className="hover:opacity-80 text-primary">
                  Administration
                </Link>
              </li>
            )}
          </ul>
          <div>
            <div className="flex justify-between items-end">
              {(pathname.startsWith("/app") && <NetworkStatus />) || <div></div>}
              <p className="text-center text-sm">
                <span className="text-fg/70 text-center">Version</span>&nbsp;
                <br />
                <span className="font-semibold text-base text-fg/90 text-center">{version}</span>
              </p>
            </div>
            <hr className="mb-5 mt-4 border-fg/20" />
            <ul className="flex justify-center items-center gap-7">
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Twitter"
                  href="https://twitter.com/LedgityPlatform"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-twitter-fill inline-block text-3xl hover:opacity-80 hover:scale-105 transition-[transform,fill]"></i>
                </Link>
              </li>
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Discord"
                  href="https://discord.gg/ledgityyield"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-discord-fill inline-block text-3xl hover:opacity-80 hover:scale-105 transition-[transform,fill]"></i>
                </Link>
              </li>
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Telegram"
                  href="https://t.me/ledgityapp"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-telegram-fill inline-block text-3xl hover:opacity-80 hover:scale-105 transition-[transform,fill]"></i>
                </Link>
              </li>
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Github"
                  href="https://github.com/ledgity-labs/Ledgity-Yield"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-github-fill inline-block text-3xl hover:opacity-80 hover:scale-105 transition-[transform,fill]"></i>
                </Link>
              </li>
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Email"
                  href="mailto:defi@ledgity.com"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-mail-fill inline-block text-3xl hover:opacity-80 hover:scale-105 transition-[transform,fill]"></i>
                </Link>
              </li>
            </ul>
          </div>
        </Card>
      </PopoverContent>
    </Popover>
  );
};
