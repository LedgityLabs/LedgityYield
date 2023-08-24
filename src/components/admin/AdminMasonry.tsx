import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {}

export const AdminMasonry: FC<Props> = ({ className, children, ...props }) => (
  <section
    className={twMerge(
      "columns-3 w-[1200px] h-[6000px] [column-gap:2.5rem] pb-10 [&_>_article]:break-inside-avoid-column [&_>_article]:mb-10 [column-fill:balance]",
      className,
    )}
    {...props}
  >
    {children}
  </section>
);
