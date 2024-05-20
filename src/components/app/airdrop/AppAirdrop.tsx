"use client";
import { Button } from "@/components/ui";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";
import galxeIcon from "~/assets/partners/galxe-icon.svg";

export const AppAirdrop: FC = () => {
  return (
    <div className="min-[750px]:w-[720px] w-full flex flex-col gap-8 pb-44 xl:scale-105 xl:mt-5">
      <div className="relative text-center flex flex-col w-full overflow-hidden bg-slate-800 rounded-[1.8rem] gap-5 border-2 border-slate-500 shadow-lg p-[1rem] pt-[6rem]">
        <div className="absolute -top-3 right-0 left-0 bg-[url('/assets/banners/multi-airdrop-square.png')] bg-cover bg-top opacity-95 w-full h-[830px] rounded-t-[1.7rem] overflow-hidden aspect-square"></div>
        <div className="flex flex-row items-center justify-center gap-3 flex-wrap">
          <h3 className="font-bold text-[1.4rem] text-slate-100 font-heading text-start whitespace-nowrap">
            ON-CHAIN QUESTS
          </h3>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "baseline" }}>
            <p className="text-slate-100/60 text-sm font-medium italic">PHASE 1 - ENDED</p>
            <p className="text-slate-100/60 text-sm font-medium italic">PHASE 2 - COMING SOON</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center">
          <a
            href="https://app.galxe.com/quest/ledgityyield/leaderboard"
            target="_blank"
            className="relative text-center min-w-[310px] w-[310px] min-h-40 border-2 border-[#d6409f]/[65%] bg-gradient-to-br from-[#361029]/50 to-[#d6409f]/70 rounded-[1.7rem] pt-5 flex flex-col gap-2 overflow-hidden hover:shadow-lg hover:scale-[102%] transition-all h-[180px] justify-between justify-center"
            style={{
              boxShadow: "3px 5px 10px 0px rgba(214, 64, 159,0.2)",
              WebkitBoxShadow: "3px 5px 10px 0px rgba(214, 64, 159,0.2)",
              backgroundColor: "darkblue",
            }}
          >
            <div className="inline-flex items-center justify-center gap-2.5">
              <div className="aspect-square rounded-lg bg-[#d6409f] w-[27px] h-[27px] inline-flex justify-center items-center">
                <Image
                  src={galxeIcon}
                  width={19}
                  height={19}
                  alt="Galxe logo"
                  className="aspect-square rounded-full"
                />
              </div>
              <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">GALXE</h4>
            </div>

            <h4 className="text-[1.15rem] font-heading font-bold text-slate-100">Complete tasks</h4>

            <div className="px-4 text-slate-200/50 font-medium text-[0.92rem] leading-[1.85] text-center">
              Claim rewards <i className="ri-coupon-2-fill" />
              <br />
              New tasks added regularly
            </div>
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        <h3 className="font-heading font-bold text-xl text-slate-700 text-center px-3">
          Any question about the project?
        </h3>
        <Link href="https://docs.ledgity.finance/" target="_blank">
          <Button size="small" className="gap-2">
            <i className="ri-book-2-fill" /> Read the documentation
          </Button>
        </Link>
      </div>
    </div>
  );
};
