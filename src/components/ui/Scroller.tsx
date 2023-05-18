import { FC } from "react";
import { twMerge } from "tailwind-merge";

export interface ScrollerProps {
  className?: string;
}

export const Scroller: FC<ScrollerProps> = ({ className }) => (
  <div
    className={twMerge(
      "border-4 rounded-lg border-fg/70 border-solid h-10 w-6 p-1",
      className
    )}
  >
    <div className="animate-roll bg-fg/70 w-2 h-2 rounded-full"></div>
  </div>
);
export default Scroller;
