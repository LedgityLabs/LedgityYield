import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: FC<InputProps> = ({ className, type, ...props }) => {
  return (
    <input
      type={type}
      className={twMerge(
        "flex h-10 w-full rounded-xl border-2 border-border bg-accent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
        className
      )}
      {...props}
    />
  );
};
