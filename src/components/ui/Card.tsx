import React from "react";
import { twMerge } from "tailwind-merge";

export const cardVariants = ["default", "borderless"] as const;
export type CardVariant = (typeof cardVariants)[number];

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "default", ...props }, ref) => (
    <div
      className={twMerge(
        "",

        // Variants
        {
          default: "",
          borderless: "",
        }[variant],

        // Custom classes
        className
      )}
      {...props}
      ref={ref}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";
export default Card;
