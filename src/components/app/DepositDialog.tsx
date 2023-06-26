import { ChangeEvent, FC, useState } from "react";
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
import * as generated from "../../generated";

interface Props extends React.ComponentPropsWithoutRef<typeof Dialog> {
  tokenSymbol: TokenSymbol;
}

export const DepositDialog: FC<Props> = ({ children, tokenSymbol }) => {
  const [value, setValue] = useState(0);

  // const { status, config, data } = generated.usePrepareLeurocInstantWithdraw({
  //   args: [BigInt(value)],
  // });
  const { write, data } = generated.useLeurocInstantWithdraw();
  // console.log(data);

  //   useContractWrite({
  //   ...contracts[`L${tokenSymbol}`],
  //   functionName: "",
  //   args: [123456789],
  // });
  // console.log(contracts[`L${tokenSymbol}`]);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit {tokenSymbol}</DialogTitle>
          <DialogDescription>
            You will receive L{tokenSymbol} in a 1:1 ratio.
            <br />
            <br />
            As soon as you hold some L{tokenSymbol}, you start earning annouced yields on those. There is
            no need to stake or else, your balance will magically grow through time. Note that your
            rewards are auto-compounded.
            <br />
            <br />
            At any time, you&apos;ll be able to withdraw your L{tokenSymbol} tokens against {tokenSymbol}{" "}
            in a 1:1 ratio.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="items-end mt-8">
          <AmountInput
            maxValue={1874654}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setValue(Number.parseInt(e.target.value))}
          />
          <Button
            size="medium"
            className="relative -top-[1.5px]"
            onClick={() =>
              write &&
              write({
                args: [BigInt(value)],
              })
            }
          >
            Deposit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
