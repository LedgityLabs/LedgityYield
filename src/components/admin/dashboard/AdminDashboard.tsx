import { Card } from "@/components/ui";
import { FC } from "react";

import { StakeTx } from "@/components/contracts";
import {
  useBalanceOf,
  useAllowances,
  useGlobalOwnerOwner,
} from "@/hooks/contracts/";
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import { getContractAddress } from "@/functions/getContractAddress";

export const AdminDashboard: FC = () => {
  const { currentAccount } = useWeb3Context();
  const LDY = getContractAddress("LDY");
  const LDYStaking = getContractAddress("LDYStaking");

  const balance = useBalanceOf(LDY, currentAccount);
  const { allowances } = useAllowances([LDY], currentAccount, LDYStaking);
  // console.log("allowances: ", allowances);
  const owner = useGlobalOwnerOwner();

  return (
    <Card className="p-10">
      <StakeTx
        params={{
          amount: "0.01",
          tokenDecimals: 18,
          stakeDurationIndex: 0,
        }}
        approveChecks={[
          {
            symbol: "LDY",
            token: LDY,
            spender: LDYStaking,
            amount: "0.01",
            tokenDecimals: 18,
          },
        ]}
        buttonText="STAKE"
        className="text-lg inline-flex gap-1 justify-center items-center sm:aspect-auto aspect-square"
      />
      <p className="text-lg font-semibold">Not available yet</p>
    </Card>
  );
};
