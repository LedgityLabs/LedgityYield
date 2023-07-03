import { FC } from "react";

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {}

export const AdminMasonry: FC<Props> = ({ className, children, ...props }) => (
  <section
    className="columns-3 w-[1200px] h-[6000px] [column-gap:2.5rem] pb-10 [&_>_*]:break-inside-avoid [&_>_*]:mb-10"
    {...props}
  >
    {children}
  </section>
);
