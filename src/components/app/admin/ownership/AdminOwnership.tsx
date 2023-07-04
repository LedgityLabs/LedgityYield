import { FC } from "react";
import { AdminMasonry } from "../AdminMasonry";
import { AdminBrick } from "../AdminBrick";
import { AdminAddressSetter } from "../AdminAddressSetter";
import { useGlobalOwnerPendingOwner, usePrepareGlobalOwnerAcceptOwnership } from "@/generated";
import { useWalletClient } from "wagmi";
import { TxButton } from "@/components/ui";

export const AdminOwnership: FC = () => {
  const { data: walletClient } = useWalletClient();
  const { data: pendingOwner } = useGlobalOwnerPendingOwner({
    watch: true,
  });
  const preparation = usePrepareGlobalOwnerAcceptOwnership();
  return (
    <AdminMasonry className="!columns-2 w-[900px]">
      <AdminBrick title="Transfer global ownership">
        <AdminAddressSetter
          contractName="GlobalOwner"
          getterFunctionName="owner"
          setterFunctionName="transferOwnership"
          txButtonName="Transfer"
        />
      </AdminBrick>
      <AdminBrick title="Receive global ownership" className="items-center">
        {pendingOwner && walletClient?.account.address === pendingOwner ? (
          <>
            <p className="text-center">The connected wallet is the recipient of a pending transfer</p>
            <TxButton preparation={preparation} size="medium">
              Accept
            </TxButton>
          </>
        ) : (
          <p className="text-center">
            It seems that no transfer is pending or that the connected wallet is not the recipient.
          </p>
        )}
      </AdminBrick>
    </AdminMasonry>
  );
};
