"use client";

import React, { FC } from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { twMerge } from "tailwind-merge";

export const RadioGroup: FC<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>> = ({
  className,
  ...props
}) => {
  return <RadioGroupPrimitive.Root className={twMerge("grid gap-2", className)} {...props} />;
};

export const RadioGroupItem: FC<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>> = ({
  className,
  children,
  ...props
}) => {
  return (
    <RadioGroupPrimitive.Item
      className={twMerge(
        "w-5 h-5 rounded-full border-2 border-border shadow-[0px_4px_12px_rgba(0,0,0,0.07)] bg-fg/5 [&[data-state='checked']]:bg-accent text-primary [&[data-state='unchecked']]:text-fg/50 font-medium [&[data-state='checked']]:font-semibold",
        className
      )}
      {...props}
    >
      {children || (
        <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
          <span className="inline-block h-2.5 aspect-square bg-primary text-fg rounded-full"></span>
        </RadioGroupPrimitive.Indicator>
      )}
    </RadioGroupPrimitive.Item>
  );
};

export const RadioGroupIndicator = RadioGroupPrimitive.Indicator;
