import { type NextPage } from "next";

interface Props {
  children: React.ReactNode;
}

export const metadata = {
  title: "Admin",
};

const AppLayout: NextPage<Props> = ({ children }) => children;

export default AppLayout;
