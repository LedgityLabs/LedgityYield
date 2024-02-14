import { FC } from "react";
import Link from "next/link";
import Logo from "./ui/Logo";
import { twMerge } from "tailwind-merge";

const Footer: FC<React.HTMLAttributes<HTMLDivElement>> = ({ className }) => {
  return (
    <footer
      className={twMerge(
        "relative flex flex-col items-center justify-center gap-10 overflow-hidden rounded-3xl bg-fg p-16 shadow-[0px_4px_12px_rgba(0,0,0,0.3)] xl:p-24",
        className,
      )}
    >
      <section className="grid w-full grid-cols-1 grid-rows-1 gap-12 lg:grid-cols-3 lg:gap-0 ">
        <article className="row-start-3 flex items-center justify-center text-bg lg:row-start-1 lg:justify-start">
          <ul className="flex gap-6 xl:gap-8">
            <li className="font-semibold text-bg/70 underline transition hover:text-bg/90">
              <Link href="/legal/terms-and-conditions" className="whitespace-nowrap">
                Terms & Conditions
              </Link>
            </li>
            <li className="font-semibold text-bg/70 underline transition hover:text-bg/90">
              <Link href="/legal/privacy-policy" className="whitespace-nowrap">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </article>
        <article className="flex items-center justify-center ">
          <Logo theme="dark" />
        </article>
        <article className="flex items-center justify-center lg:justify-end">
          <ul className="flex items-center justify-center gap-7">
            <li className="flex items-center justify-center">
              <Link
                aria-label="Twitter"
                href="https://twitter.com/LedgityYield"
                target="_blank"
                className="inline-block h-8 w-8"
              >
                <i className="ri-twitter-fill inline-block text-4xl text-bg transition-[transform,fill] hover:scale-110 hover:text-accent"></i>
              </Link>
            </li>
            <li className="flex items-center justify-center">
              <Link
                aria-label="Discord"
                href="https://discord.gg/ledgityyield"
                target="_blank"
                className="inline-block h-8 w-8"
              >
                <i className="ri-discord-fill inline-block text-4xl text-bg transition-[transform,fill] hover:scale-110 hover:text-accent"></i>
              </Link>
            </li>

            <li className="flex items-center justify-center">
              <Link
                aria-label="Telegram"
                href="https://t.me/ledgityapp"
                target="_blank"
                className="inline-block h-8 w-8"
              >
                <i className="ri-telegram-fill inline-block text-4xl text-bg transition-[transform,fill] hover:scale-110 hover:text-accent"></i>
              </Link>
            </li>
            <li className="flex items-center justify-center">
              <Link
                aria-label="Github"
                href="https://github.com/LedgityLabs/LedgityYield"
                target="_blank"
                className="inline-block h-8 w-8"
              >
                <i className="ri-github-fill inline-block text-4xl text-bg transition-[transform,fill] hover:scale-110 hover:text-accent"></i>
              </Link>
            </li>
            <li className="flex items-center justify-center">
              <Link
                aria-label="Email"
                href="mailto:contact@ledgity.finance"
                target="_blank"
                className="inline-block h-8 w-8"
              >
                <i className="ri-mail-fill inline-block text-4xl text-bg transition-[transform,fill] hover:scale-110 hover:text-accent"></i>
              </Link>
            </li>
            {/* <li className="flex items-center justify-center">
                <Link
                  aria-label="Gitbook"
                  href="https://docs.ledgity.finance/"
                  target="_blank"
                  className="inline-block h-8 w-8"
                >
                  <i className="ri-book-2-fill inline-block text-4xl text-primary transition-[transform,fill] hover:scale-110 hover:text-accent"></i>
                </Link>
              </li> */}
          </ul>
        </article>
      </section>
    </footer>
  );
};
export default Footer;
