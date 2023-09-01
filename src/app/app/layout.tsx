import { SmallScreenMessage } from "@/components/SmallScreenMessage";
import { type NextPage } from "next";

interface Props {
  children: React.ReactNode;
}

export const metadata = {
  title: "App",
};

const AppLayout: NextPage<Props> = ({ children }) => {
  return (
    <>
      {/* <SmallScreenMessage /> */}
      {children}
    </>
  );
};

export default AppLayout;
