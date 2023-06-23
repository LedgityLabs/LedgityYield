import { FC } from "react";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  timestamp: number;
  output?: "date" | "time" | "both";
}

export const DateTime: FC<Props> = ({ timestamp, output = "both", ...props }) => {
  const date = new Date(timestamp);
  let formattedOutput = "";
  if (output === "both") formattedOutput = date.toLocaleString();
  else if (output === "date") formattedOutput = date.toLocaleDateString();
  else formattedOutput = date.toLocaleTimeString();
  return <span {...props}>{formattedOutput}</span>;
};
