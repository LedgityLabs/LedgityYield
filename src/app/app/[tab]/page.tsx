import { Metadata } from "next";
import AppTabs from "./AppTabs";

export function generateStaticParams() {
  const tabs = ["dashboard", "invest", "airdrop", "get-usdc", "pre-mining"];

  return tabs.map((tab) => ({
    tab: tab,
  }));
}

type Props = {
  params: { tab: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const title = {
    dashboard: "Dashboard",
    invest: "Invest",
    airdrop: "Multi-Airdrop",
    "get-usdc": "Get USDC",
    "pre-mining": "Pre-Mining",
  }[params.tab];

  return {
    title: `Ledgity Yield • ${title}`,
  };
}

//@ts-ignore
const Page: NextPage = ({ params }: { params: { tab: string } }) => {
  return <AppTabs defaultTab={params.tab} />;
};

export default Page;
