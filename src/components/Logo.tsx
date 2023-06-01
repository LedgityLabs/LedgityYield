import Image from "next/image";
import Link from "next/link";
import logoLight from "~/assets/logo/light.png";
import logoDark from "~/assets/logo/dark.png";
import { FC } from "react";

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  theme?: "light" | "dark";
}
export const Logo: FC<Props> = ({ theme = "light", ...props }) => {
  return (
    <Link href="/" className="flex pt-1" {...props}>
      <Image
        alt="Ledgity Logo"
        src={theme === "light" ? logoLight : logoDark}
        className="h-9 w-auto cursor-pointer"
        width={121}
      />
      <p className="-mt-0.5 ml-2 self-start rounded-[6px] bg-indigo-500 px-1 py-1 font-body text-[0.68rem] font-semibold leading-none tracking-wider antialiased text-white">
        DeFi
      </p>
    </Link>
  );
};
export default Logo;
