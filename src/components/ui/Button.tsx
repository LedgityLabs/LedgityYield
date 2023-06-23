import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export const buttonVariants = ["primary", "outline", "destructive"] as const;
export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonSizes = ["tiny", "small", "medium", "large"] as const;
export type ButtonSize = (typeof buttonSizes)[number];

export interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, disabled = false, variant = "primary", size = "medium", ...props }, ref) => (
    <button
      className={twMerge(
        "relative inline-flex items-center justify-center rounded-[0.8rem] font-semibold transition-colors hover:bg-opacity-80 shadow-[0px_4px_12px_rgba(0,0,0,0.11)] overflow-hidden",

        // Variants
        {
          primary: "bg-primary text-primary-fg ",
          destructive: "bg-destructive text-destructive-fg ",
          outline:
            "bg-accent text-fg/80 hover:bg-bg border-2 border-border shadow-[0px_4px_12px_rgba(0,0,0,0.07)] rounded-[0.85rem]",
        }[variant],

        // Sizes
        {
          tiny: clsx("px-3 text-sm", variant === "outline" ? "h-[calc(2.25rem+3px)]" : "h-9"),
          small: "h-10 py-2 px-4 text-base",
          // +2px is used to balance the visual height of the button between outline and default variants
          medium: clsx("px-4 text-lg", variant === "outline" ? "h-[calc(2.9rem+3px)]" : "h-[2.9rem]"),
          large: clsx("px-7 text-lg", variant === "outline" ? "h-[calc(2.9rem+3px)]" : "h-[2.9rem]"),
        }[size],

        // Custom classes
        className
      )}
      disabled={disabled}
      {...props}
      ref={ref}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";
