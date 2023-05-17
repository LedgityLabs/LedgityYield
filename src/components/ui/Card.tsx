import React from "react";
import { twMerge } from "tailwind-merge";

export const cardRadiuses = ["default", "full"] as const;
export type CardRadius = (typeof cardRadiuses)[number];

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: CardRadius;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, radius = "default", ...props }, ref) => (
    <>
      <article
        className={
          "bg-card-border " + // Must be outside, else twMerge will override it
          twMerge(
            "card", // Used by <CardsHelper />
            "bg-fg/10 backdrop-blur-md shadow-slate-200 p-[2px] shadow-sm inline-block h-min",

            // Radiuses
            {
              default: "rounded-3xl",
              full: "rounded-full",
            }[radius]
          )
        }
      >
        <div
          className={
            "bg-card-content " + // Must be outside, else twMerge will override it
            twMerge(
              "card",
              "bg-indigo-50 backdrop-blur-md",

              // Radiuses
              {
                default: "rounded-[1.4rem]",
                full: "rounded-full",
              }[radius],

              // Custom classes
              className
            )
          }
          {...props}
          ref={ref}
        >
          {children}
        </div>
      </article>
    </>
  )
);
Card.displayName = "Card";
export default Card;
