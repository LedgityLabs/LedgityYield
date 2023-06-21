import { FC } from "react";
import { Button } from "@/components/ui";
import Logo from "@/components/ui/Logo";
import { ConnectButton } from "@/components/app/ConnectButton";

const AppHeader: FC = () => {
  return (
    <header className="pb-[97px] relative z-50">
      <nav className="fixed flex items-center px-6 py-6 w-screen sm:backdrop-blur-md justify-between">
        <Logo className="flex [@media(max-width:500px)]:hidden ml-2" />
        <Logo className="[@media(max-width:500px)]:flex hidden ml-2" noText={true} />

        <div className="flex gap-6">
          <ConnectButton />
          <Button className="flex justify-center items-center font-bold w-12" variant="outline">
            <i className="ri-more-2-fill text-2xl "></i>
          </Button>
        </div>
      </nav>
    </header>
  );
};
export default AppHeader;
