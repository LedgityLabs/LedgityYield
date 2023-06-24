import { FC } from "react";
import * as d3 from "d3-format";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  tooltip?: boolean;
}

export const Amount: FC<Props> = ({ value, className, tooltip = true, ...props }) => {
  let formattedAmount = d3.format(".3s")(value);
  formattedAmount = formattedAmount.replace("G", "B");
  if (!tooltip)
    return (
      <span className={className} {...props}>
        {formattedAmount}
      </span>
    );
  else
    return (
      <Tooltip>
        <TooltipTrigger className={twMerge("cursor-help", className)}>{formattedAmount}</TooltipTrigger>
        <TooltipContent>{value.toLocaleString()}</TooltipContent>
      </Tooltip>
    );
};
