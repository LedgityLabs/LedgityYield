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
              <p>
                Oops it looks like there are currently not enough fund on the contract to cover your
                request plus the 845 requests before you in the queue.
                <br />
                <br />
                You can put your request in queue and you&apos;ll be able to process it later when the
                Ledgity financial team would have repatriated required funds on the contract.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-end mt-8">
          <AmountInput maxValue={71324654} />
          <Button size="medium" className="relative -top-[1.5px]">
            Withdraw
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
