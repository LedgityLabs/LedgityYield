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

  return (
    <AdminBrick title="Addresses" className="gap-10">
      <div className="flex flex-col gap-5">
        <h4 className="text-lg font-semibold">Withdrawer Account</h4>
        <p>
          Current address:{" "}
          <AddressElement address={currentWithdrawer} copyable={true} />
        </p>
        <div className="flex justify-center items-end gap-3">
          <Input
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewWithdrawerAddress(e.target.value)
            }
          />
          <SetWithdrawerTx
            contractAddress={lTokenAddress}
            params={{ withdrawerAddress: newWithdrawerAddress as Address }}
            buttonText="Set Withdrawer"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h4 className="text-lg font-semibold">Fund Account</h4>
        <p>
          Current address:{" "}
          <AddressElement address={currentFund} copyable={true} />
        </p>
        <div className="flex justify-center items-end gap-3">
          <Input
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewFundAddress(e.target.value)
            }
          />
          <SetFundTx
            contractAddress={lTokenAddress}
            params={{ fundAddress: newFundAddress as Address }}
            buttonText="Set Fund"
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h4 className="text-lg font-semibold">LDY Staking Contract</h4>
        <p>
          Current address:{" "}
          <AddressElement address={currentLdyStaking} copyable={true} />
        </p>
        <div className="flex justify-center items-end gap-3">
          <Input
            type="text"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewLdyStakingAddress(e.target.value)
            }
          />
          <SetLdyStakingTx
            contractAddress={lTokenAddress}
            params={{ ldyStakingAddress: newLdyStakingAddress as Address }}
            buttonText="Set LDY Staking"
          />
        </div>
      </div>
    </AdminBrick>
  );
}
