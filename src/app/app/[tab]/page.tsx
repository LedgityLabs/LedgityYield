import AppTabs from "./AppTabs";

export function generateStaticParams() {
  const tabs = ["dashboard", "invest", "airdrop", "get-usdc", "pre-mining"];

  return tabs.map((tab) => ({
    tab: tab,
  }));
}

//@ts-ignore
const Page: NextPage = ({ params }: { params: { tab: string } }) => {
  return <AppTabs defaultTab={params.tab} />;
};

export default Page;
