import { Address, Card, Input, Rate, TxButton } from "@/components/ui";
import { RateInput } from "@/components/ui/RateInput";
import { useLTokenGetApr, usePrepareLTokenSetApr } from "@/generated";
import { useContractAddress } from "@/hooks/useContractAddress";
import { ChangeEvent, FC, useState } from "react";
import { twMerge } from "tailwind-merge";
import { parseUnits } from "viem";
import { ContractId, LTokenId } from "../../../../../hardhat/deployments";
import { AdminBrick } from "../AdminBrick";
import { useContractRead, usePrepareContractWrite } from "wagmi";
import { AdminAddressSetter } from "../AdminAddressSetter";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenId: LTokenId;
}

export const AdminLTokenAddresses: FC<Props> = ({ className, lTokenId }) => {
  const lTokenAddress = useContractAddress(lTokenId);
  const addressesAccesses = [
    ["Withdrawer wallet", "withdrawer", "setWithdrawer"],
    ["Fund wallet", "fund", "setFund"],
    ["LTYStaking contract", "ltyStaking", "setLTYStaking"],
  ];

  return (
    <AdminBrick title="Addresses" className="gap-10">
      {addressesAccesses.map(([displayName, getterName, setterName]) => (
        <AdminAddressSetter
          key={getterName}
          displayName={displayName}
          contractName={lTokenId}
          getterFunctionName={getterName}
          setterFunctionName={setterName}
        />
      ))}
    </AdminBrick>
  );
};
