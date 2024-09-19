"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import clsx from "clsx";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

export const TooltipProvider = TooltipPrimitive.Provider;

export const Tooltip = TooltipPrimitive.Root;

export const TooltipTrigger: FC<TooltipPrimitive.TooltipTriggerProps> = ({
  children,
  className,
  ...props
}) => (
  <TooltipPrimitive.Trigger className={className} {...props} asChild>
    <span>{children}</span>
  </TooltipPrimitive.Trigger>
);

export const TooltipArrow = TooltipPrimitive.Arrow;

export const tooltipContentVariants = ["primary", "destructive"] as const;
export type TooltipContentVariant = (typeof tooltipContentVariants)[number];

interface TooltipContentProps extends TooltipPrimitive.TooltipContentProps {
  variant?: TooltipContentVariant;
}

export const TooltipContent: FC<TooltipContentProps> = ({
  className,
  children,
  variant = "primary",
  ...props
}) => (
  <TooltipPrimitive.Content
    className={twMerge(
      "text-sm text-bg px-2 py-1 z-50 rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.3)] animate-fadeIn data-[state='closed']:animate-fadeOut ![animation-duration:150ms]",
      {
        primary: "bg-fg",
        destructive: "bg-red-500 font-semibold",
      }[variant],
      className
    )}
    sideOffset={12}
    collisionPadding={16}
    {...props}
  >
    <TooltipPrimitive.Arrow
      className={clsx(
        "shadow-[0px_4px_12px_rgba(0,0,0,0.3)]",
        {
          primary: "fill-fg",
          destructive: "fill-red-500",
        }[variant]
      )}
    ></TooltipPrimitive.Arrow>
    {children}
  </TooltipPrimitive.Content>
);
