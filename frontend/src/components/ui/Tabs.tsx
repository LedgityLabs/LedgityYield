"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

export const Tabs = TabsPrimitive.Root;

export const TabsList: FC<React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>> = ({
  className,
  ...props
}) => (
  <TabsPrimitive.List
    className={twMerge(
      "inline-flex max-w-fit justify-center shadow-[0px_4px_12px_rgba(0,0,0,0.07)] rounded-[0.85rem] font-semibold text-base p-1.5 gap-1.5 bg-fg/10 flex-wrap",
      className,
    )}
    {...props}
  />
);

export const TabsTrigger: FC<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>> = ({
  className,
  ...props
}) => (
  <TabsPrimitive.Trigger
    className={twMerge(
      "rounded-[0.6rem] [&[data-state='active']]:bg-accent [&[data-state='inactive']]:text-fg/50  px-3.5 py-1.5 whitespace-nowrap",
      className,
    )}
    {...props}
  />
);

export const TabsContent: FC<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>> = ({
  className,
  ...props
}) => <TabsPrimitive.Content className={twMerge("", className)} {...props} />;
