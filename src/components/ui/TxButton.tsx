import { FC } from "react";
import { Button } from "./Button";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { usePrepareLeurocDeposit } from "@/generated";

interface Props extends React.ComponentPropsWithoutRef<typeof Button> {
  preparation: ReturnType<typeof usePrepareContractWrite>;
}

export const TxButton: FC<Props> = ({ preparation, ...props }) => {
  const { write, isLoading } = useContractWrite(preparation.config);
  return (
    <Button
      {...props}
      disabled={!write}
      loading={preparation.isFetching || preparation.isLoading || isLoading}
      onClick={() => write!()}
    />
  );
};

const Usage: FC = () => {
  const preparation = usePrepareLeurocDeposit({
    args: [123456789n],
  });

  return (
    <div>
      Blabla
      <TxButton preparation={preparation}>Deposit</TxButton>
    </div>
  );
};
