"use client";
import { FC, useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FadeIn: FC<FadeInProps> = ({ children, ...props }) => {
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      if (container.current) {
        const end = container.current.offsetHeight < window.innerHeight ? "30% bottom" : `10% bottom`;
        gsap.from(container.current, {
          y: "40%",
          opacity: 0,
          transform: "scale(140%)",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom", // when the top of the trigger hits the bottom of the viewport
            end: end, // when the bottom of the trigger hits the top of the viewport
            scrub: 1, // smooth scrubbing, takes 1 second to "catch up" to the scrollbar
          },
        });
      }
    });
    return () => ctx.revert(); // cleanup
  });

  return (
    <div ref={container} {...props}>
      {children}
    </div>
  );
};
