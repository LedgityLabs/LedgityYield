import { FC } from "react";
import Logo from "@/components/ui/Logo";
import { ConnectButton } from "@/components/app/ConnectButton";
import { DotsMenu } from "../DotsMenu";

const AppHeader: FC = () => {
  return (
    <header className="relative z-50 pb-[97px]">
      <nav className="fixed flex w-screen items-center justify-between px-6 py-6 backdrop-blur-md">
        <Logo className="ml-2 hidden md:flex" />
        <Logo className="ml-2 flex md:hidden" noText={true} />

        <div className="flex gap-6">
          <ConnectButton />
          <DotsMenu />
        </div>
      </nav>
    </header>
  );
};
export default AppHeader;
