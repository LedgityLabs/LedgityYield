import { FC } from "react";
import { AdminBrick } from "../AdminBrick";
import { AdminAddressSetter } from "../AdminAddressSetter";
import { Card } from "@/components/ui";

interface Props extends React.ComponentPropsWithRef<typeof Card> {
  lTokenSymbol: string;
}

export const AdminLTokenAddresses: FC<Props> = ({
  className,
  lTokenSymbol,
}) => {
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
          contractName={lTokenSymbol}
          getterFunctionName={getterName}
          setterFunctionName={setterName}
        />
      ))}
    </AdminBrick>
  );
};
