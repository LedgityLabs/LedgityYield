import { Card } from "@/components/ui";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  title: string;
}

export const AdminBrick: FC<Props> = ({ className, children, title, ...props }) => (
  <Card
    circleIntensity={0.07}
    className={twMerge("p-8 h-min flex flex-col gap-5", className)}
    {...props}
  >
    <h3 className="text-center font-bold text-2xl pb-4 font-heading text-fg/90">{title}</h3>
    {children}
  </Card>
);
