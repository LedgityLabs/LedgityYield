"use client";
import { FC, useLayoutEffect, useRef } from "react";
import anime, { type AnimeInstance } from "animejs";
import { animateScroll } from "@/lib/animateScroll";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  startAt?: "top" | "bottom";
}

export const FadeIn: FC<FadeInProps> = ({ children, startAt = "top", ...props }) => {
  const fadedDiv = useRef<HTMLDivElement>(null);

  // useLayoutEffect(() => {
  //   const divAnimation = anime({
  //     targets: fadedDiv.current!,
  //     // scale: [1.5, 1],
  //     translateY: [200, 0],
  //     easing: "easeInOutCubic",
  //     // opacity: [0, 1],
  //     duration: 1000,
  //     autoplay: false,
  //   });

  //   return animateScroll(divAnimation, fadedDiv.current!, startAt);
  // }, []);

  return (
    <div ref={fadedDiv} className="will-change-[transform,opacity]" {...props}>
      {children}
    </div>
  );
};
