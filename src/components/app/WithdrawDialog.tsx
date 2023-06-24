import { FC } from "react";
import {
  AmountInput,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { TokenSymbol } from "@/lib/tokens";

interface Props extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tokenSymbol: TokenSymbol;
}

export const WithdrawDialog: FC<Props> = ({ children, tokenSymbol }) => {
  const instantWithdrawAvailable = false;
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Witdhraw {tokenSymbol}</DialogTitle>
          <DialogDescription>
            You will receive {tokenSymbol} in a 1:1 ratio.
            <br />
            <br />
            {!instantWithdrawAvailable && (
              <div className="bg-blue-100 rounded-2xl p-6 pt-4">
                <h4 className="text-blue-500 text-lg font-semibold mb-2">
                  <i className="ri-information-line"></i> Your request will be queued
                </h4>
                <p>
                  Only a small portion of deposited funds are kept on the contract as they are invested
                  off-chain. Actually, the contract doesn&apos;t hold enough funds to cover your request
                  plus ones before you in the queue.
                  <br />
                  <br />
                  Your request will so be queued and then automatically processed as soon as the Ledgity
                  financial team would have repatriated required funds on the contract.
                  <br />
                  <br />
                  <span className="font-semibold">
                    You&apos;ll be invited to pay a small 0.004ETH
                  </span>{" "}
                  fee to cover the gas cost of the transaction that will process your withdrawal when the
                  time comes.
                </p>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-end mt-8 flex-nowrap">
          <AmountInput maxValue={71324654} />
          <Button size="medium" className="relative -top-[1.5px]">
            {instantWithdrawAvailable ? "Withdraw" : "Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
