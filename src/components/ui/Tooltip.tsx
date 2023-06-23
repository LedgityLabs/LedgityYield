"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = TooltipPrimitive.Root;

export const TooltipTrigger: FC<TooltipPrimitive.TooltipTriggerProps> = ({
  children,
  className,
  ...props
}) => (
  <TooltipPrimitive.Trigger className={twMerge("cursor-help", className)} {...props}>
    {children}
  </TooltipPrimitive.Trigger>
);

export const TooltipArrow = TooltipPrimitive.Arrow;

export const TooltipContent: FC<TooltipPrimitive.TooltipContentProps> = ({
  className,
  children,
  ...props
}) => (
  <TooltipPrimitive.Content
    className={twMerge("bg-fg text-sm text-bg px-2 py-1 z-50 rounded-lg", className)}
    sideOffset={12}
    collisionPadding={16}
    {...props}
  >
    <TooltipPrimitive.Arrow className="fill-fg "></TooltipPrimitive.Arrow>
    {children}
  </TooltipPrimitive.Content>
);
