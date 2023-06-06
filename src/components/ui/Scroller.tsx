"use client";
import { FC, useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

export interface ScrollerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Scroller: FC<ScrollerProps> = ({ className, ...props }) => {
  const [opacity, setOpacity] = useState(0);
  const handleScroll = () =>
    setOpacity(1 - (window.scrollY / screen.height) * 3);

  useEffect(() => {
    handleScroll();
    document.addEventListener("scroll", handleScroll);
    return () => document.removeEventListener("scroll", handleScroll);
  });

  return (
    <div
      style={{ opacity: opacity }}
      className={twMerge(
        "border-4 rounded-lg border-fg/70 border-solid h-10 w-6 p-1",
        className
      )}
      {...props}
    >
      <div className="animate-roll bg-fg/70 w-2 h-2 rounded-full"></div>
    </div>
  );
};
