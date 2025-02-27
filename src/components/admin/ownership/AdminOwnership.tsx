import { ChangeEvent, useState } from "react";
import { Address } from "viem";
// Components
import { AdminBrick } from "@/components/admin/AdminBrick";
import { AdminMasonry } from "@/components/admin/AdminMasonry";
import { AcceptOwnershipTx, TransferOwnershipTx } from "@/components/contracts";
import { AddressElement, Input } from "@/components/ui";
// Hooks
import { useWeb3Context } from "@/hooks/context/Web3ContextProvider";
import {
  useGlobalOwnerOwner,
  useGlobalOwnerPendingOwner,
} from "@/hooks/contracts";

export function AdminOwnership() {
  const { currentAccount } = useWeb3Context();
  const currentOwner = useGlobalOwnerOwner();
  const pendingOwner = useGlobalOwnerPendingOwner();

  const [newOwnerAddress, setNewOwnerAddress] = useState("");

  return (
    <AdminMasonry className="!columns-2 w-[900px]">
      <AdminBrick title="Transfer global ownership">
        <div className="flex flex-col gap-5">
          <p>
            Current address:{" "}
            <AddressElement address={currentOwner} copyable={true} />
          </p>
          <div className="flex justify-center items-end gap-3">
            <Input
              type="text"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setNewOwnerAddress(e.target.value)
              }
            />
            <TransferOwnershipTx
              params={{ newOwner: newOwnerAddress as Address }}
              buttonText="Transfer"
            />
          </div>
        </div>
      </AdminBrick>
      <AdminBrick title="Receive global ownership" className="items-center">
        {currentAccount === pendingOwner ? (
          <>
            <p className="text-center">
              The connected wallet is the recipient of a pending transfer
            </p>
            <AcceptOwnershipTx buttonText="Accept" />
          </>
        ) : (
          <p className="text-center">
            It seems that no transfer is pending or that the connected wallet is
            not the recipient.
          </p>
        )}
      </AdminBrick>
    </AdminMasonry>
  );
}
