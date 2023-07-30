import { FC } from "react";
import { LTokenId } from "../../../../../contracts/deployments";
import { AdminBrick } from "../AdminBrick";
import { AdminAddressSetter } from "../AdminAddressSetter";
import { Card } from "@/components/ui";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenId: LTokenId;
}

export const AdminLTokenAddresses: FC<Props> = ({ className, lTokenId }) => {
  const addressesAccesses = [
    ["Withdrawer wallet", "withdrawer", "setWithdrawer"],
    ["Fund wallet", "fund", "setFund"],
    ["LDYStaking contract", "ldyStaking", "setLDYStaking"],
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
