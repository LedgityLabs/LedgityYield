"use client";
import clsx from "clsx";
import { FC } from "react";

export interface ScrollerProps {
  className?: string;
}

const Scroller: FC<ScrollerProps> = ({ className }) => (
  <div
    className={clsx(
      "border-4 rounded-lg border-fg/70 border-solid h-10 w-6 p-1",
      className
    )}
  >
    <style jsx>{`
      @keyframes roll {
        0% {
          opacity: 0;
        }
        20% {
          margin-top: 0;
          opacity: 1;
        }
        80% {
          margin-top: 16px;
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      .wheel {
        animation: 2s infinite normal roll ease;
      }
    `}</style>
    <div className="wheel bg-fg/70 w-2 h-2 rounded-full"></div>
  </div>
);
export default Scroller;
