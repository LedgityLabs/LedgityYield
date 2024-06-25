import { type NextPage } from "next";
import  MailToolTip from "@/components/mail/MailTooltip";


interface Props {
  children: React.ReactNode;
}

export const metadata = {
  title: "App",
};

const AppLayout: NextPage<Props> = ({ children }) => {
  return <>
  {children}
  <MailToolTip/>
  
  </>;
};

export default AppLayout;
