"use client";

import React, { FC } from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { twMerge } from "tailwind-merge";

export const Switch: FC<React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>> = ({
  className,
  ...props
}) => (
  <SwitchPrimitives.Root
    className={twMerge(
      "inline-flex h-[2rem] w-[4rem] cursor-pointer shadow-[0px_4px_12px_rgba(0,0,0,0.07)] rounded-3xl bg-fg/[0.15] p-1.5",
      props.disabled && "cursor-not-allowed",
      className
    )}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={twMerge(
        "pointer-events-none block h-full aspect-square rounded-full bg-accent shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[2rem] data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
);
