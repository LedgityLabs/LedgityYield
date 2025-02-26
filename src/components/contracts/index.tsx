import {
  ERC20ApproveCheck,
  TxButtonWrapper,
  TxButtonWrapperProps,
} from "@/components/contracts/TxButtonWrapper";
import { Address } from "viem";
import {
  ParamsStake,
  configStake,
  // ERC-20
  ParamsApprove,
  configApprove,
  ParamsMint,
  configMint,
  // LTokenSignaler
  ParamsSignalLToken,
  configSignalLToken,
  // LToken
  ParamsSetApr,
  configSetApr,
  ParamsClaimFees,
  configClaimFees,
  ParamsSetFeesRate,
  configSetFeesRate,
  ParamsSetRetentionRate,
  configSetRetentionRate,
  ParamsProcessBigQueuedRequest,
  configProcessBigQueuedRequest,
  ParamsProcessQueuedRequests,
  configProcessQueuedRequests,
  ParamsRepatriate,
  configRepatriate,
  ParamsCancelWithdrawalRequest,
  configCancelWithdrawalRequest,
  ParamsDeposit,
  configDeposit,
  ParamsInstantWithdrawal,
  configInstantWithdrawal,
  ParamsRequestWithdrawal,
  configRequestWithdrawal,
  ParamsSetFund,
  configSetFund,
  ParamsSetLdyStaking,
  configSetLdyStaking,
  ParamsSetWithdrawer,
  configSetWithdrawer,
  // GlobalOwner
  ParamsAcceptOwnership,
  configAcceptOwnership,
  ParamsTransferOwnership,
  configTransferOwnership,
  // GlobalPause
  ParamsPause,
  configPause,
  ParamsUnpause,
  configUnpause,
  // PreMining
  ParamsInstantUnlock,
  configInstantUnlock,
  ParamsRequestUnlock,
  configRequestUnlock,
  // LdyStaking
  ParamsUnstake,
  configUnstake,
  ParamsGetReward,
  configGetReward,
} from "@/hooks/contracts";

// When the tx interacts with a contract without token dependencies
type TxButtonProps<T> = Omit<TxButtonWrapperProps, "buttonConfig"> & {
  params: T;
};

// When the tx interacts with a contract without token dependencies
type TxButtonSetProps<T> = Omit<TxButtonWrapperProps, "buttonConfig"> & {
  params: T;
  contractAddress: Address;
};

// When the tx interacts directly with a token
type TxTokenButtonProps<T> = Omit<TxButtonWrapperProps, "buttonConfig"> & {
  params: T;
  tokenAddress: Address;
};

// When the tx depends on a token and might require approval
type TxButtonApproveProps<T> = Omit<TxButtonWrapperProps, "buttonConfig"> & {
  params: T;
  approveChecks: ERC20ApproveCheck[];
};

// When the tx depends on a token and might require approval for a set of contracts
type TxButtonSetApproveProps<T> = Omit<TxButtonWrapperProps, "buttonConfig"> & {
  contractAddress: Address;
  params: T;
  approveChecks: ERC20ApproveCheck[];
};

export const {
  // ====== Tokens ====== //
  StakeTx,
  // ====== ERC-20 ====== //
  ApproveTx,
  MintTx,
  // ====== LTokenSignaler ====== //
  SignalerSignalLTokenTx,
  // ====== LToken ====== //
  SetAprTx,
  ClaimFeesTx,
  SetFeesRateTx,
  SetRetentionRateTx,
  ProcessBigQueuedRequestTx,
  ProcessQueuedRequestsTx,
  RepatriateTx,
  CancelWithdrawalRequestTx,
  DepositTx,
  InstantWithdrawalTx,
  RequestWithdrawalTx,
  SetFundTx,
  SetLdyStakingTx,
  SetWithdrawerTx,
  // ====== GlobalOwner ====== //
  AcceptOwnershipTx,
  TransferOwnershipTx,
  // ====== GlobalPause ====== //
  PauseTx,
  UnpauseTx,
  // ====== PreMining ====== //
  InstantUnlockTx,
  RequestUnlockTx,
  // ====== LdyStaking ====== //
  UnstakeTx,
  GetRewardTx,
} = {
  // ====== Tokens ====== //
  StakeTx: (props: TxButtonApproveProps<ParamsStake>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configStake,
        makeInstance: () => configStake.makeInstance(),
      }}
    />
  ),

  // ====== ERC-20 ====== //
  ApproveTx: (props: TxTokenButtonProps<ParamsApprove>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configApprove,
        makeInstance: () => configApprove.makeInstance(props.tokenAddress),
      }}
    />
  ),

  MintTx: (props: TxTokenButtonProps<ParamsMint>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configMint,
        makeInstance: () => configMint.makeInstance(props.tokenAddress),
      }}
    />
  ),

  // ====== LTokenSignaler ====== //
  SignalerSignalLTokenTx: (props: TxButtonProps<ParamsSignalLToken>) => (
    <TxButtonWrapper {...props} buttonConfig={configSignalLToken} />
  ),

  // ====== LToken ====== //
  SetAprTx: (props: TxButtonSetApproveProps<ParamsSetApr>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configSetApr,
        makeInstance: () => configSetApr.makeInstance(props.contractAddress),
      }}
    />
  ),

  ClaimFeesTx: (props: TxButtonSetProps<ParamsClaimFees>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configClaimFees,
        makeInstance: () => configClaimFees.makeInstance(props.contractAddress),
      }}
    />
  ),

  SetFeesRateTx: (props: TxButtonSetProps<ParamsSetFeesRate>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configSetFeesRate,
        makeInstance: () =>
          configSetFeesRate.makeInstance(props.contractAddress),
      }}
    />
  ),

  SetRetentionRateTx: (props: TxButtonSetProps<ParamsSetRetentionRate>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configSetRetentionRate,
        makeInstance: () =>
          configSetRetentionRate.makeInstance(props.contractAddress),
      }}
    />
  ),

  ProcessBigQueuedRequestTx: (
    props: TxButtonSetApproveProps<ParamsProcessBigQueuedRequest>,
  ) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configProcessBigQueuedRequest,
        makeInstance: () =>
          configProcessBigQueuedRequest.makeInstance(props.contractAddress),
      }}
    />
  ),

  ProcessQueuedRequestsTx: (
    props: TxButtonSetProps<ParamsProcessQueuedRequests>,
  ) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configProcessQueuedRequests,
        makeInstance: () =>
          configProcessQueuedRequests.makeInstance(props.contractAddress),
      }}
    />
  ),

  RepatriateTx: (props: TxButtonSetApproveProps<ParamsRepatriate>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configRepatriate,
        makeInstance: () =>
          configRepatriate.makeInstance(props.contractAddress),
      }}
    />
  ),

  CancelWithdrawalRequestTx: (
    props: TxButtonSetProps<ParamsCancelWithdrawalRequest>,
  ) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configCancelWithdrawalRequest,
        makeInstance: () =>
          configCancelWithdrawalRequest.makeInstance(props.contractAddress),
      }}
    />
  ),

  DepositTx: (props: TxButtonSetApproveProps<ParamsDeposit>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configDeposit,
        makeInstance: () => configDeposit.makeInstance(props.contractAddress),
      }}
    />
  ),

  InstantWithdrawalTx: (props: TxButtonSetProps<ParamsInstantWithdrawal>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configInstantWithdrawal,
        makeInstance: () =>
          configInstantWithdrawal.makeInstance(props.contractAddress),
      }}
    />
  ),

  RequestWithdrawalTx: (props: TxButtonSetProps<ParamsRequestWithdrawal>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configRequestWithdrawal,
        makeInstance: () =>
          configRequestWithdrawal.makeInstance(props.contractAddress),
      }}
    />
  ),

  SetFundTx: (props: TxButtonSetProps<ParamsSetFund>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configSetFund,
        makeInstance: () => configSetFund.makeInstance(props.contractAddress),
      }}
    />
  ),

  SetLdyStakingTx: (props: TxButtonSetProps<ParamsSetLdyStaking>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configSetLdyStaking,
        makeInstance: () =>
          configSetLdyStaking.makeInstance(props.contractAddress),
      }}
    />
  ),

  SetWithdrawerTx: (props: TxButtonSetProps<ParamsSetWithdrawer>) => (
    <TxButtonWrapper
      {...props}
      buttonConfig={{
        ...configSetWithdrawer,
        makeInstance: () =>
          configSetWithdrawer.makeInstance(props.contractAddress),
      }}
    />
  ),

  // ====== GlobalOwner ====== //
  AcceptOwnershipTx: (props: TxButtonProps<ParamsAcceptOwnership>) => (
    <TxButtonWrapper {...props} buttonConfig={configAcceptOwnership} />
  ),

  TransferOwnershipTx: (props: TxButtonProps<ParamsTransferOwnership>) => (
    <TxButtonWrapper {...props} buttonConfig={configTransferOwnership} />
  ),

  // ====== GlobalPause ====== //
  PauseTx: (props: TxButtonProps<ParamsPause>) => (
    <TxButtonWrapper {...props} buttonConfig={configPause} />
  ),

  UnpauseTx: (props: TxButtonProps<ParamsUnpause>) => (
    <TxButtonWrapper {...props} buttonConfig={configUnpause} />
  ),

  // ====== PreMining ====== //
  InstantUnlockTx: (props: TxButtonProps<ParamsInstantUnlock>) => (
    <TxButtonWrapper {...props} buttonConfig={configInstantUnlock} />
  ),

  RequestUnlockTx: (props: TxButtonProps<ParamsRequestUnlock>) => (
    <TxButtonWrapper {...props} buttonConfig={configRequestUnlock} />
  ),

  // ====== LdyStaking ====== //
  UnstakeTx: (props: TxButtonProps<ParamsUnstake>) => (
    <TxButtonWrapper {...props} buttonConfig={configUnstake} />
  ),

  GetRewardTx: (props: TxButtonProps<ParamsGetReward>) => (
    <TxButtonWrapper {...props} buttonConfig={configGetReward} />
  ),
} as const;
