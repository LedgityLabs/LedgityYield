import React, { FC } from "react";
import { twMerge } from "tailwind-merge";
import { Card } from "./Card";

export const cubeSizes = ["tiny", "small", "medium", "large"] as const;
export type CubeSize = (typeof cubeSizes)[number];

export interface CubeProps extends React.HTMLAttributes<HTMLDivElement> {
  size: CubeSize;
}

export const Cube: FC<CubeProps> = ({ className, children, size = "medium", ...props }) => {
  // Randomly figure out if it's a reversed cube
  const reverse = Math.random() < 0.5;

  // return null;
  return (
    <div
      className={twMerge(
        "absolute backdrop-blur-md rounded-[2rem] opacity-[25%] blur-[1.5px] hover:blur-none",
        !reverse &&
          {
            tiny: "animate-[spin_19s_ease-in-out_infinite]",
            small: "animate-[spin_22s_ease-in-out_infinite]",
            medium: "animate-[spin_25s_ease-in-out_infinite]",
            large: "animate-[spin_28s_ease-in-out_infinite]",
          }[size],
        reverse &&
          {
            tiny: "animate-[spin_19s_ease-in-out_infinite_reverse]",
            small: "animate-[spin_22s_ease-in-out_infinite_reverse]",
            medium: "animate-[spin_25s_ease-in-out_infinite_reverse]",
            large: "animate-[spin_28s_ease-in-out_infinite_reverse]",
          }[size],
        className,
      )}
      {...props}
    >
      <Card
        defaultGradient={true}
        className={twMerge(
          "before:opacity-[35%] bg-card-illustrations",
          {
            tiny: "w-24 h-24",
            small: "w-32 h-32",
            medium: "w-44 h-44",
            large: "w-52 h-52",
          }[size],
        )}
      >
        {children}
      </Card>
    </div>
  );
};
