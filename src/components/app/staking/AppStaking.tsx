// Components
import { Card, Spinner } from "@/components/ui";
import { AppStakingDescription } from "./AppStakingDescription";
import { AppStakingPane } from "./AppStakingPane";
import { AppStakingPools } from "./AppStakingPools";
// Hooks
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { useAppDataContext } from "@/hooks/context/AppDataContextProvider";
import {
  useBalanceOf,
  useRewardRatePerSec,
  useTotalWeightedStake,
} from "@/hooks/contracts";

export function AppStaking() {
  const { currentAccount, appChainId } = useWeb3Context();
  const { tokenInfos } = useAppDataContext();

  const rewardRate = useRewardRatePerSec();
  const totalWeightedStake = useTotalWeightedStake();

  const ldyTokenData = tokenInfos.find(
    (token) => token.symbol === "LDY" && token.chainId === appChainId,
  );
  const ldyBalance = useBalanceOf(ldyTokenData?.address, currentAccount);

  if (!tokenInfos.length)
    return (
      <section className="w-full h-full flex items-center justify-center">
        <Spinner />
      </section>
    );

  if (!ldyTokenData)
    return (
      <section className="w-full h-full flex items-center justify-center text-2xl font-bold">
        <div> Staking is not available on this chain.</div>
      </section>
    );

  return (
    <section className="lg:w-[1080px] grid grid-cols-12 gap-5 pb-10 w-full h-full px-2">
      <Card
        circleIntensity={0.07}
        defaultGradient={true}
        className="w-full flex flex-col col-span-12 xl:col-span-6 gap-2 p-2"
      >
        <AppStakingPane
          ldyTokenData={ldyTokenData}
          ldyTokenBalance={ldyBalance}
          rewardRate={Number(rewardRate)}
          totalWeightedStake={Number(totalWeightedStake)}
        />
      </Card>

      <Card
        circleIntensity={0.07}
        defaultGradient={true}
        className="w-full flex flex-col col-span-12 xl:col-span-6 gap-8 p-2"
      >
        <AppStakingDescription />
      </Card>

      <Card
        circleIntensity={0.07}
        defaultGradient={false}
        className="w-full flex flex-col gap-8 col-span-12 before:bg-primary p-2"
      >
        <AppStakingPools
          ldyTokenData={ldyTokenData}
          ldyTokenBalance={ldyBalance}
          rewardRate={Number(rewardRate)}
          totalWeightedStake={Number(totalWeightedStake)}
        />
      </Card>
    </section>
  );
}
