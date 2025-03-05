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

  const [circleSize, setCircleSize] = useState(100);

  return (
    <Comp
      className={twMerge(
        animated && "card-glow", // @dev Used by useGlowCardEffect
        defaultGradient ? "bg-card-border-default" : "bg-card-border",
        "relative drop-shadow-sm p-[2px]",
        "before:absolute before:inset-[2px] before:-z-1",
        defaultGradient
          ? "before:bg-card-content-default"
          : "before:bg-card-content",
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
