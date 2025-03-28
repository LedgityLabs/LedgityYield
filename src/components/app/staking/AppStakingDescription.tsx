import { FC } from "react";

export const AppStakingDescription: FC = () => {
  return (
    <div className="flex flex-col justify-start gap-y-2 p-4">
      <div className="font-heading font-bold text-xl">YOUR PERKS</div>
      <div className="font-heading font-semibold text-lg py-2">
        Stake at least 10,000 $LDY for 12months
      </div>
      <div className="font-medium flex items-center">
        <i className="ri-checkbox-circle-line text-xl" />
        <span className="mx-1">0% Withdrawal fees</span>
      </div>
      <div className="font-medium flex items-center">
        <i className="ri-checkbox-circle-line text-xl" />
        <span className="mx-1">Access to Leverage Vault</span>
      </div>
      <div className="font-medium flex items-center">
        <i className="ri-checkbox-circle-line text-xl" />
        <span className="mx-1">Access to L-Boost Vault</span>
      </div>
      <div className="font-medium flex items-center">
        <i className="ri-checkbox-circle-line text-xl" />
        <span className="mx-1">Advanced overview of the RWA Portfolio</span>
      </div>
    </div>
  );
};
