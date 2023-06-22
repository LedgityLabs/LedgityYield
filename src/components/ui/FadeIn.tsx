"use client";
import { FC, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  yOffset?: number;
}

export const FadeIn: FC<FadeInProps> = ({ children, yOffset = 200, ...props }) => {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (container.current && window.innerWidth >= 640) {
      const ctx = gsap.context(() => {
        gsap.from(container.current, {
          y: `${yOffset}px`,
          scale: 1.4,
          opacity: 0,
          scrollTrigger: {
            trigger: container.current,
            start: "3% bottom", // when the top of the trigger hits the bottom of the viewport
            end: "top 75%", // when the top of the trigger hits 70% from top viewport
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
          },
        });
      });
      return () => ctx.revert();
    }
    return () => {};
  });

  return (
    <div ref={container} className="will-change-[transform,opacity]" {...props}>
      {children}
    </div>
  );
};
