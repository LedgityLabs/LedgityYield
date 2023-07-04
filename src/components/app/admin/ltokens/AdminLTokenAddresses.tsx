import { FC } from "react";
import { LTokenId } from "../../../../../hardhat/deployments";
import { AdminBrick } from "../AdminBrick";
import { AdminAddressSetter } from "../AdminAddressSetter";

interface Props extends React.ComponentPropsWithRef<typeof AdminBrick> {
  lTokenId: LTokenId;
}

export const AdminLTokenAddresses: FC<Props> = ({ className, lTokenId }) => {
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
