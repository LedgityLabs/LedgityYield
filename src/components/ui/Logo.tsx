import Image from "next/image";
import Link from "next/link";
import logoLight from "~/assets/logo/logoLight.svg";
import logoDark from "~/assets/logo/logoDark.svg";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  theme?: "light" | "dark";
  noText?: boolean;
}
export const Logo: FC<Props> = ({ className, theme = "light", noText = false, ...props }) => {
  const logo = theme === "light" ? logoLight : logoDark;
  return (
    <Link
      href="/"
      className={twMerge("flex items-center pt-1 hover:opacity-70 transition-opacity", className)}
      {...props}
    >
      <Image alt="Ledgity Logo" src={logo} className="h-9 w-auto cursor-pointer" height={40} />
      {/* <p
        className={twMerge(
          "h-full ml-[0.3rem] px-1.5 py-1.5 font-heading text-[1.8rem] font-semibold leading-none antialiased text-fg",
          theme === "dark" && "text-bg",
        )}
      >
        Ledgity
        <span className="text-primary ml-1">Yield</span>
      </p> */}
    </Link>
  );
};
export default Logo;
