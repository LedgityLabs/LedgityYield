import { FC } from "react";
import { Button } from "./Button";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

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
