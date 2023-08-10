import { FC } from "react";
import Link from "next/link";
import clsx from "clsx";
import Logo from "../ui/Logo";
import { FadeIn } from "../ui";
import ledgityLogoDark from "~/assets/logo/dark.png";
import Image from "next/image";

const SiteFooter: FC = () => {
  return (
    <FadeIn yOffset={40}>
      <footer
        className={clsx(
          "bg-fg xl:p-24 p-16 flex flex-col justify-center items-center gap-10 relative overflow-hidden rounded-3xl m-7 shadow-[0px_4px_12px_rgba(0,0,0,0.3)]",
        )}
      >
        <section className="grid lg:grid-cols-3 grid-cols-1 lg:gap-0 gap-12 grid-rows-1 w-full ">
          <article className="text-bg flex lg:justify-start justify-center items-center lg:row-start-1 row-start-3">
            <ul className="flex xl:gap-8 gap-6">
              <li className="font-semibold text-bg/70 underline hover:text-bg/90 transition">
                <Link href="/" target="_blank" className="whitespace-nowrap">
                  Terms & Conditions
                </Link>
              </li>
              <li className="font-semibold text-bg/70 underline hover:text-bg/90 transition">
                <Link href="/" target="_blank" className="whitespace-nowrap">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </article>
          <article className="flex justify-center items-center ">
            <Logo theme="dark" />
          </article>
          <article className="flex lg:justify-end justify-center items-center">
            <ul className="flex justify-center items-center gap-7">
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Twitter"
                  href="https://twitter.com/LedgityPlatform"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-twitter-fill inline-block text-bg text-4xl hover:text-accent hover:scale-110 transition-[transform,fill]"></i>
                </Link>
              </li>
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Discord"
                  href="https://discord.gg/ledgityyield"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-discord-fill inline-block text-bg text-4xl hover:text-accent hover:scale-110 transition-[transform,fill]"></i>
                </Link>
              </li>
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Telegram"
                  href="https://t.me/ledgityapp"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-telegram-fill inline-block text-bg text-4xl hover:text-accent hover:scale-110 transition-[transform,fill]"></i>
                </Link>
              </li>
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Github"
                  href="https://github.com/ledgity-labs/Ledgity-Yield"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-github-fill inline-block text-bg text-4xl hover:text-accent hover:scale-110 transition-[transform,fill]"></i>
                </Link>
              </li>
              <li className="flex justify-center items-center">
                <Link
                  aria-label="Email"
                  href="mailto:defi@ledgity.com"
                  target="_blank"
                  className="w-8 h-8 inline-block"
                >
                  <i className="ri-mail-fill inline-block text-bg text-4xl hover:text-accent hover:scale-110 transition-[transform,fill]"></i>
                </Link>
              </li>
            </ul>
          </article>
        </section>
      </footer>
    </FadeIn>
  );
};
export default SiteFooter;
