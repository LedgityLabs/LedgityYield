// "use client";
import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export const cardRadiuses = ["default", "full"] as const;
export type CardRadius = (typeof cardRadiuses)[number];

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  radius?: CardRadius;
  defaultGradient?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, radius = "default", defaultGradient = false, ...props }, ref) => {
    // const card = useRef<HTMLDivElement | null>(null);
    // useEffect(() => {
    //   if (card.current) {
    //     card.current.style.setProperty("--mouse-x", `-10000px`);
    //     card.current.style.setProperty("--mouse-y", `-10000px`);
    //   }
    // });
    return (
      <>
        <article
          // ref={card}
          className={twMerge(
            !defaultGradient && "bg-card-border",
            defaultGradient && "bg-card-border-default",
            "card", // Used by <CardsHelper />
            "shadow-slate-200 p-[2px] shadow-sm h-min",

            // Radiuses
            {
              default: "rounded-[1.8rem]",
              full: "rounded-full",
            }[radius]
          )}
        >
          <div
            className={twMerge(
              "card", // Used by <CardsHelper />
              "bg-indigo-50 bg-opacity-90",

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
