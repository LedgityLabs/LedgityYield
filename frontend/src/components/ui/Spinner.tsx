import React, { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLElement> {}

export const Spinner: FC<Props> = ({ className, ...props }) => (
  <i {...props} className={twMerge("ri-loader-4-line inline-block animate-spin text-xl", className)}></i>
);
