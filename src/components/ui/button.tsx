import React, { FC } from "react";
import clsx from "clsx";

export const buttonVariants = [
  "default",
  "secondary",
  "outline",
  "destructive",
] as const;
export type ButtonVariant = (typeof buttonVariants)[number];

export const buttonSizes = ["small", "default", "large"] as const;
export type ButtonSize = (typeof buttonSizes)[number];

export interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button: FC<ButtonProps> = ({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}) => (
  <button
    className={clsx(
      "inline-flex items-center justify-center rounded-md font-medium transition-colors hover:bg-opacity-80",

      // Variants
      {
        default: "bg-primary text-primary-fg",
        destructive: "bg-destructive text-destructive-fg",
        outline: "border-2 border-input hover:bg-accent hover:text-accent-fg",
        secondary: "bg-secondary text-secondary-fg",
      }[variant],

      // Sizes
      {
        small: "h-9 px-3 text-sm",
        default: "h-10 py-2 px-4 text-base",
        large: "h-11 px-8 text-lg",
      }[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
);
