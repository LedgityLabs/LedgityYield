import React from "react";
import { twMerge } from "tailwind-merge";

export const cardRadiuses = ["default", "full"] as const;
export type CardRadius = (typeof cardRadiuses)[number];

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: CardRadius;
  defaultGradient?: boolean;
  animated?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    { className, children, radius = "default", defaultGradient = false, animated = true, ...props },
    ref
  ) => {
    return (
      <>
        <article
          className={twMerge(
            animated && "card", // Used by <CardsHelper />
            defaultGradient ? "bg-card-border-default" : "bg-card-border",
            "shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-[2px] h-min ",

            // Radiuses
            {
              default: "rounded-[1.8rem]",
              full: "rounded-full",
            }[radius]
          )}
        >
          <div
            className={twMerge(
              animated && "card", // Used by <CardsHelper />
              "bg-bg",

              // Radiuses
              {
                default: "rounded-[1.7rem]",
                full: "rounded-full",
              }[radius],

              // Custom classes
              className
            )}
            {...props}
            ref={ref}
          >
            {children}
          </div>
        </article>
      </>
    );
  }
);
Card.displayName = "Card";
