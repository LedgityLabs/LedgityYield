"use client";

import { Button, Card } from "@/components/ui";
import Link from "next/link";
import { FC } from "react";

export const AppLDYToken: FC = () => {
  return (
    <section className="w-[800px] pb-10">
      <Card className="flex flex-col items-center gap-11 pt-10">
        <h2 className="text-center font-bold text-3xl font-heading text-fg/90">Lockdrop</h2>
        <p className="font-bold text-lg text-center text-primary -mt-4">
          Lock USDC and receive very first LDY tokens.
          <br />
          <span className="text-fg">You&apos;ll receive back your USDC after the lock period.</span>
        </p>
        <div className="border border-fg/10 rounded-2xl overflow-hidden drop-shadow-md">
          <table className="table-auto">
            <tbody className="divide-solid divide-y divide-fg/10">
              <tr>
                <td className="font-medium font-heading text-base text-primary py-2.5 px-4 bg-primary/[10%]">
                  Amount limit
                </td>
                <td className="font-semibold text-base text-fg py-2.5 px-4 text-center">
                  First 5M USDC
                </td>
              </tr>

              <tr>
                <td className="font-medium font-heading text-base text-primary py-2.5 px-4 bg-primary/[10%]">
                  % of 1Y supply
                </td>
                <td className="font-semibold text-base text-fg py-2.5 px-4 text-center">~7%</td>
              </tr>
              <tr>
                <td className="font-medium font-heading text-base text-primary py-2.5 px-4 bg-primary/[10%]">
                  % of total supply
                </td>
                <td className="font-semibold text-base text-fg py-2.5 px-4 text-center">2%</td>
              </tr>
              <tr>
                <td className="font-medium font-heading text-base text-primary py-2.5 px-4 bg-primary/[10%]">
                  Lock duration
                </td>
                <td className="font-semibold text-base text-fg py-2.5 px-4 text-center">1 year</td>
              </tr>
              <tr>
                <td className="font-medium font-heading text-base text-primary py-2.5 px-4 bg-primary/[10%]">
                  Start date
                </td>
                <td className="font-semibold text-base text-fg py-2.5 px-4 text-center">TBA</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-fg flex flex-col gap-7 justify-center items-center pt-10 pb-10 w-full rounded-b-[1.7rem]">
          <p className="font-bold text-2xl text-center text-bg">
            Want to be notified when lockdrop starts?
          </p>
          <ul className="flex gap-5 justify-center items-center max-w-[30rem] flex-wrap">
            <li>
              <Link href="https://twitter.com/LedgityYield">
                <Button size="small" className="bg-[#1DA1F2] text-white">
                  <i className="ri-twitter-fill text-[1.33rem] mr-1.5"></i>Follow us on Twitter
                </Button>
              </Link>
            </li>
            <li>
              <Link href="">
                <Button size="small" className="bg-[#229ED9] text-white">
                  <i className="ri-telegram-fill text-[1.33rem] mr-1.5"></i>Join our Telegram
                </Button>
              </Link>
            </li>
            <li>
              <Link href="">
                <Button size="small" className="bg-[#7289da] text-white">
                  <i className="ri-discord-fill text-[1.33rem] mr-1.5"></i>Join our Discord
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      </Card>
    </section>
  );
};
