import { FC } from "react";
import * as d3 from "d3-format";

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
}

export const Amount: FC<Props> = ({ value, ...props }) => {
  let formattedAmount = d3.format(".3s")(value);
  formattedAmount = formattedAmount.replace("G", "B");
  return <span {...props}>{formattedAmount}</span>;
};
