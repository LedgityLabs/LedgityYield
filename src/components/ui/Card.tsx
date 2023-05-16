import React from "react";
import { twMerge } from "tailwind-merge";

export const cardVariants = ["default", "borderless"] as const;
export type CardVariant = (typeof cardVariants)[number];

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "default", ...props }, ref) => (
    <>
      <article
        className={twMerge(
          "card", // Used by CardsHelper
          "rounded-3xl bg-primary/5 backdrop-blur-md  shadow-slate-200",

          // Variants
          {
            default: "border-input border-[3px] shadow-lg",
            borderless: "border-input/20 border-2 shadow-sm",
          }[variant],

          // Custom classes
          className,
          "bg-card"
        )}
        {...props}
        ref={ref}
      >
        {children}
      </article>
    </>
  )
);
Card.displayName = "Card";
export default Card;
