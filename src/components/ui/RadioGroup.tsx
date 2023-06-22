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

export const RadioGroupItem: FC<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>> = (
  { className, children, ...props },
  ref
) => {
  return (
    <RadioGroupPrimitive.Item
      className={twMerge(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {/* <Circle className="h-2.5 w-2.5 fill-current text-current" /> */}
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
};
