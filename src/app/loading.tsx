import Image from "next/image";
import logoIconLight from "~/assets/logo/iconLight.svg";
import clsx from "clsx";
import { Spinner } from "@/components/ui";

const Page = () => {
  return (
    <main
      className={clsx(
        "relative z-[100] flex flex-col justify-end items-center gap-3 pb-6 w-screen h-screen bg-gradient-to-tr from-bg to-accent transition-opacity duration-1000 animate-fadeIn",
      )}
    >
      <Image
        src={logoIconLight}
        alt="loader logo"
        width={35}
        className="animate-pulse duration-[2000ms]"
      />
      <Spinner />
    </main>
  );
};

export default Page;
