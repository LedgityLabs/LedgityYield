"use client";
import React, { FC, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";

export const cardRadiuses = ["default", "full"] as const;
export type CardRadius = (typeof cardRadiuses)[number];

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: CardRadius;
  defaultGradient?: boolean;
  animated?: boolean;
  asChild?: boolean;
  circleIntensity?: number;
}

export const Card: FC<CardProps> = ({
  className,
  children,
  radius = "default",
  defaultGradient = false,
  animated = true,
  circleIntensity = 0.15,
  asChild = false,
  ...props
}) => {
  const Comp = asChild ? Slot : "article";
  const card = useRef<HTMLElement>();
  const [circleSize, setCircleSize] = useState(100);
  useEffect(() => {
    if (card.current) {
      setCircleSize((card.current.offsetHeight + card.current.offsetWidth) / 2.2);
    }
  }, [card]);
  useEffect(() => {
    if (card.current) {
      card.current.style.setProperty("--circle-size", `${circleSize}px`);
      card.current.style.setProperty("--circle-intensity", circleIntensity.toString());
    }
  }, [circleSize, circleIntensity]);
  return (
    <Comp
      //@ts-ignore
      ref={card}
      className={twMerge(
        animated && "card", // Used by <CardsHelper />
        defaultGradient ? "bg-card-border-default" : "bg-card-border",
        "relative drop-shadow-sm p-[2px]",
        "before:absolute before:inset-[2px] before:-z-1",
        defaultGradient ? "before:bg-card-content-default" : "before:bg-card-content",
        // drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))
        // Radiuses
        {
          default: "rounded-[1.8rem] before:rounded-[1.7rem]",
          full: "rounded-full before:rounded-full",
        }[radius],
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};
