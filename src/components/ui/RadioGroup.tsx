"use client";

import React, { FC } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { twMerge } from "tailwind-merge";

export const RadioGroup: FC<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
> = ({ className, ...props }) => {
  return (
    <RadioGroupPrimitive.Root
      className={twMerge("grid gap-2", className)}
      {...props}
    />
  );
};

export const RadioGroupItem: FC<
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
> = ({ className, children, ...props }) => {
  return (
    <RadioGroupPrimitive.Item
      className={twMerge(
        "h-5 w-5 rounded-full border-2 border-border bg-fg/[0.07] font-medium text-primary shadow-[0px_4px_12px_rgba(0,0,0,0.07)] [&[data-state='checked']]:bg-accent [&[data-state='checked']]:font-semibold [&[data-state='unchecked']]:text-fg/50",
        className,
      )}
      {...props}
    >
      {children || (
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="inline-block aspect-square h-2.5 rounded-full bg-primary text-fg"></span>
        </RadioGroupPrimitive.Indicator>
      )}
    </RadioGroupPrimitive.Item>
  );
};

export const RadioGroupIndicator = RadioGroupPrimitive.Indicator;
