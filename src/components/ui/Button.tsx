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
  isLoading?: boolean;
  isError?: boolean;
  isSuccess?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "medium",
      disabled = false,
      isLoading = false,
      isError = false,
      isSuccess = false,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading || isError || isSuccess;
    return (
      <button
        className={twMerge(
          "relative inline-flex items-center justify-center rounded-[0.8rem] font-semibold transition-colors  overflow-hidden whitespace-nowrap",
          !isDisabled && "hover:bg-opacity-80",

          // Variants
          {
            primary: "bg-primary text-primary-fg border-indigo-200 border-2",
            destructive: "bg-destructive text-destructive-fg ",
            outline: clsx("bg-accent text-fg/80 border-2 border-border rounded-[0.85rem]"),
          }[variant],

          // Sizes
          {
            tiny: clsx("px-3 text-sm", variant === "outline" ? "h-[calc(2.25rem+3px)]" : "h-9"),
            small: clsx("h-11 py-2 px-4 text-base"),
            medium: clsx("px-4 text-lg h-12"),
            large: clsx("px-7 text-lg h-12"),
          }[size],

          // Shadow
          {
            tiny: {
              default: "shadow-[0px_4px_12px_rgba(0,0,0,0.03)]",
              outline: "shadow-[0px_4px_12px_rgba(0,0,0,0.07)]",
            },
            small: {
              default: "shadow-[0px_4px_12px_rgba(0,0,0,0.11)]",
              outline: "shadow-[0px_4px_12px_rgba(0,0,0,0.07)]",
            },
            medium: {
              default: "shadow-[0px_4px_12px_rgba(0,0,0,0.11)]",
              outline: "shadow-[0px_4px_12px_rgba(0,0,0,0.07)]",
            },
            large: {
              default: "shadow-[0px_4px_12px_rgba(0,0,0,0.11)]",
              outline: "shadow-[0px_4px_12px_rgba(0,0,0,0.07)]",
            },
          }[size][variant === "outline" ? "outline" : "default"],

          // Custom classes
          className,
        )}
        disabled={isDisabled}
        {...props}
        ref={ref}
      >
        {children}
        <span
          className={twMerge(
            "hidden absolute inset-0 justify-center items-center",
            isLoading && "flex",
          )}
        >
          <span className="inline-flex items-center justify-center w-6 h-6 min-h-min min-w-min max-w-min max-h-6 aspect-square rounded-full backdrop-blur-xl animate-spin">
            <i className="ri-loader-4-line text-lg text-fg"></i>
          </span>
        </span>

        <span
          className={twMerge(
            "hidden absolute inset-0 justify-center items-center",
            isError && "flex",
          )}
        >
          <span className="inline-flex items-center justify-center w-6 h-6 min-h-min min-w-min max-w-min max-h-6 aspect-square rounded-full backdrop-blur-xl animate-spin bg-red-340">
            <i className="ri-close-fill text-lg text-fg"></i>
          </span>
        </span>

        <span
          className={twMerge(
            "hidden absolute inset-0 justify-center items-center",
            isSuccess && "flex",
          )}
        >
          <span className="inline-flex items-center justify-center w-6 h-6 min-h-min min-w-min max-w-min max-h-6 aspect-square rounded-full backdrop-blur-xl animate-spin bg-emerald-340">
            <i className="ri-check- text-lg text-fg"></i>
          </span>
        </span>
      </button>
    );
  },
);
Button.displayName = "Button";
