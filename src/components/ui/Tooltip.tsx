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
  <>
    <span>{children}</span>
  </>
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
}) => <>{children}</>;
