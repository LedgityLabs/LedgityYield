"use client";

import { Button, Card } from "@/components/ui";
import Link from "next/link";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export const AppLDYToken: FC = () => {
  return (
    <section className="w-[800px] pb-10">
      <Card className="flex flex-col items-center gap-11 pt-10">
        <h2 className="text-center font-heading text-3xl font-bold text-fg/90">Lockdrop</h2>
        <p className="-mt-4 text-center text-lg font-bold text-primary">
          <span className="text-xl">Lock USDC and receive very first LDY tokens</span>
          <br />
          <span className="mt-1 inline-block font-semibold text-fg/[80%]">
            You&apos;ll receive back your USDC after the lock period
          </span>
        </p>
        <div className="overflow-hidden rounded-2xl border border-fg/10 drop-shadow-md">
          <table className="table-auto">
            <tbody className="divide-y divide-solid divide-fg/10">
              <tr>
                <td className="bg-primary/[10%] px-4 py-2.5 font-heading text-base font-medium text-primary">
                  Amount limit
                </td>
                <td className="px-4 py-2.5 text-center text-base font-semibold text-fg">
                  First 5M USDC
                </td>
              </tr>

              <tr>
                <td className="bg-primary/[10%] px-4 py-2.5 font-heading text-base font-medium text-primary">
                  % of 1Y supply
                </td>
                <td className="px-4 py-2.5 text-center text-base font-semibold text-fg">~7%</td>
              </tr>
              <tr>
                <td className="bg-primary/[10%] px-4 py-2.5 font-heading text-base font-medium text-primary">
                  % of total supply
                </td>
                <td className="px-4 py-2.5 text-center text-base font-semibold text-fg">2%</td>
              </tr>
              <tr>
                <td className="bg-primary/[10%] px-4 py-2.5 font-heading text-base font-medium text-primary">
                  Lock duration
                </td>
                <td className="px-4 py-2.5 text-center text-base font-semibold text-fg">1 year</td>
              </tr>
              <tr>
                <td className="bg-primary/[10%] px-4 py-2.5 font-heading text-base font-medium text-primary">
                  Start date
                </td>
                <td className="px-4 py-2.5 text-center text-base font-semibold text-fg">TBA</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-7 rounded-b-[1.7rem] bg-fg pb-10 pt-10">
          <p className="text-center text-2xl font-bold text-bg">
            Want to be notified when it starts?
          </p>
          <ul className="mt-10 flex max-w-[30rem] flex-wrap items-center justify-center gap-5">
            <li>
              <div className="absolute -right-[10%] -top-[2rem] z-20 flex items-center justify-center gap-1 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-700 px-[0.47rem] py-[0.08rem] text-center text-[0.8rem] font-bold text-white">
                <i className="ri-heart-3-fill text-x animate-pulse" />
                Prefered option
                <i className="ri-arrow-down-s-fill absolute -bottom-[1.33rem] left-1.5 -z-10 text-3xl text-orange-500"></i>
              </div>
              <Link href="/">
                <Button size="small" className="bg-[#7289da] text-white">
                  <i className="ri-discord-fill mr-1.5 text-[1.36rem]"></i>Join our Discord
                </Button>
              </Link>
            </li>
            <li>
              <Link href="https://twitter.com/LedgityYield">
                <Button
                  size="small"
                  className="border-2 border-bg/30 bg-[#0f1419] text-bg transition-opacity hover:opacity-60"
                >
                  <i className="ri-twitter-x-line mr-1.5 text-[1.29rem]"></i>Follow us on X
                  (Twitter)
                </Button>
              </Link>
            </li>
            <li>
              <Link href="https://t.me/LedgityYield">
                <Button size="small" className="bg-[#229ED9] text-white">
                  <i className="ri-telegram-fill mr-1.5 text-[1.36rem]"></i>Join our Telegram
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      </Card>
    </section>
  );
};
