import { FC } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  timestamp: number;
  output?: "date" | "time" | "both";
  tooltip?: boolean;
}

export const DateTime: FC<Props> = ({ timestamp, output = "both", tooltip = true, ...props }) => {
  const date = new Date(timestamp);
  if (output === "both") return <span {...props}>{date.toLocaleString()}</span>;
  else {
    const visibleContent = output === "date" ? date.toLocaleDateString() : date.toLocaleTimeString();
    if (!tooltip) return <span {...props}>{visibleContent}</span>;
    else {
      const tooltipContent = output === "date" ? date.toLocaleTimeString() : date.toLocaleDateString();
      return (
        <Tooltip>
          <TooltipTrigger className="cursor-help" asChild>
            <span {...props}>{visibleContent}</span>
          </TooltipTrigger>
          <TooltipContent>{tooltipContent}</TooltipContent>
        </Tooltip>
      );
    }
  }
};
