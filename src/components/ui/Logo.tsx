import Image from "next/image";
import Link from "next/link";
import logoLight from "~/assets/logo/logoLight.svg";
import logoDark from "~/assets/logo/logoDark.svg";
import iconLight from "~/assets/logo/iconLight.svg";
import iconDark from "~/assets/logo/iconDark.svg";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  theme?: "light" | "dark";
  noText?: boolean;
}
export const Logo: FC<Props> = ({
  className,
  theme = "light",
  noText = false,
  ...props
}) => {
  let logo: any;
  if (noText) logo = theme === "light" ? iconLight : iconDark;
  else logo = theme === "light" ? logoLight : logoDark;
  return (
    <Link
      href="/"
      className={twMerge(
        "flex items-center pt-1 hover:opacity-70 transition-opacity",
        className,
      )}
      {...props}
    >
      <Image
        alt="Ledgity Yield Logo"
        src={logo}
        className="h-9 w-auto cursor-pointer"
        height={35}
      />
    </Link>
  );
};
export default Logo;
