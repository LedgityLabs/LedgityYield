import { ChangeEvent, useState } from "react";
import { Address } from "viem";
// Components
import { AdminBrick } from "@/components/admin/AdminBrick";
import {
  SetFundTx,
  SetLdyStakingTx,
  SetWithdrawerTx,
} from "@/components/contracts";
import { AddressElement, Input } from "@/components/ui";
// Hooks
import {
  useLTokenFund,
  useLTokenLdyStaking,
  useLTokenWithdrawer,
} from "@/hooks/contracts";

export function AdminLTokenAddresses({
  lTokenAddress,
}: {
  lTokenAddress: Address | undefined;
}) {
  const currentWithdrawer = useLTokenWithdrawer();
  const currentFund = useLTokenFund();
  const currentLdyStaking = useLTokenLdyStaking();

  const [newWithdrawerAddress, setNewWithdrawerAddress] = useState("");
  const [newFundAddress, setNewFundAddress] = useState("");
  const [newLdyStakingAddress, setNewLdyStakingAddress] = useState("");

  if (!lTokenAddress) return <></>;

  const actionConfigs = [
    {
      title: "Withdrawer Account",
      current: currentWithdrawer,
      setter: setNewWithdrawerAddress,
      button: (
        <SetWithdrawerTx
          contractAddress={lTokenAddress}
          params={{ withdrawerAddress: newWithdrawerAddress as Address }}
          buttonText="Set Withdrawer"
        />
      ),
    },
    {
      title: "Fund Account",
      current: currentFund,
      setter: setNewFundAddress,
      button: (
        <SetFundTx
          contractAddress={lTokenAddress}
          params={{ fundAddress: newFundAddress as Address }}
          buttonText="Set Fund"
        />
      ),
    },
    {
      title: "LDY Staking Contract",
      current: currentLdyStaking,
      setter: setNewLdyStakingAddress,
      button: (
        <SetLdyStakingTx
          contractAddress={lTokenAddress}
          params={{ ldyStakingAddress: newLdyStakingAddress as Address }}
          buttonText="Set LDY Staking"
        />
      ),
    },
  ];

  return (
    <AdminBrick title="Addresses" className="gap-10">
      {actionConfigs.map(({ title, current, setter, button }) => (
        <div className="flex flex-col gap-5">
          <h4 className="text-lg font-semibold">{title}</h4>
          <p>
            Current address:{" "}
            <AddressElement address={current} copyable={true} />
          </p>
          <div className="flex justify-center items-end gap-3">
            <Input
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setter(e.target.value)
              }
            />
            {button}
          </div>
        </div>
      ))}
    </AdminBrick>
  );
}
