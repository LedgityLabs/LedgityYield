import clsx from "clsx";
import { FC } from "react";

export interface ScrollerProps {
  className?: string;
}

export const Scroller: FC<ScrollerProps> = ({ className }) => (
  <div
    className={clsx(
      "border-4 rounded-lg border-fg/70 border-solid h-10 w-6 p-1",
      className
    )}
  >
    <div className="animate-roll bg-fg/70 w-2 h-2 rounded-full"></div>
  </div>
);
export default Scroller;
