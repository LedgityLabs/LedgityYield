import Image from "next/image";
import Link from "next/link";
import logoLight from "~/assets/logo/stablity-light.png";
import logoDark from "~/assets/logo/stablity-dark.png";
import logoIconLight from "~/assets/logo/iconLight.png";
import logoIconDark from "~/assets/logo/iconDark.png";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
  theme?: "light" | "dark";
  noText?: boolean;
}
export const Logo: FC<Props> = ({ className, theme = "light", noText = false, ...props }) => {
  let logo;
  if (noText) logo = theme === "light" ? logoIconLight : logoIconDark;
  else logo = theme === "light" ? logoLight : logoDark;
  return (
    <Link
      href="/"
      className={twMerge(
        "flex gap-3 justify-center items-center pt-1 hover:opacity-70 transition-opacity",
        className,
      )}
      {...props}
    >
      <Image alt="Stablity Logo" src={logo} className="h-9 w-auto cursor-pointer" width={121} />
      <h1 className={twMerge("font-heading text-[1.8rem]", theme === "dark" && "text-bg")}>Stablity</h1>
    </Link>
  );
};
export default Logo;

// interface Props extends React.HTMLAttributes<HTMLAnchorElement> {
//   theme?: "light" | "dark";
//   noText?: boolean;
// }
// export const Logo: FC<Props> = ({ className, theme = "light", noText = false, ...props }) => {
//   let logo;
//   if (noText) logo = theme === "light" ? logoIconLight : logoIconDark;
//   else logo = theme === "light" ? logoLight : logoDark;
//   return (
//     <Link
//       href="/"
//       className={twMerge("flex pt-1 hover:opacity-70 transition-opacity", className)}
//       {...props}
//     >
//       <Image alt="Ledgity Logo" src={logo} className="h-9 w-auto cursor-pointer" width={121} />
//       <p className="-mt-0.5 ml-2 self-start rounded-[6px] bg-indigo-500 px-1 py-1 font-body text-[0.68rem] font-semibold leading-none tracking-wider antialiased text-white">
//         DeFi
//       </p>
//     </Link>
//   );
// };
// export default Logo;
