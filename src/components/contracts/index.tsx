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
  // Wrapped
  ParamsDepositAndWrap,
  configDepositAndWrap,
  ParamsWrap,
  configWrap,
  ParamsUnwrap,
  configUnwrap,
} from "@/hooks/contracts";
import { txModalDescriptions } from "@/functions/txDescriptions";

// Create a utility type just for the params property
type OptionalParams<T> =
  T extends Record<string, never> ? { params?: T } : { params: T };

// Create a utility for external button props exposed in the implementations
type ExternalButtonProps<T> = OptionalParams<T> &
  Omit<TxButtonWrapperProps<T>, "buttonConfig" | "makeDescription">;

// When the tx interacts with a single known contract
type TxButtonProps<T> = ExternalButtonProps<T>;

// When the tx interacts with a set of contracts
type TxButtonSetProps<T> = ExternalButtonProps<T> & {
  contractAddress: Address | undefined;
};

// When the tx depends on a token and might require approval
type TxButtonApproveProps<T> = ExternalButtonProps<T> & {
  approveChecks: ERC20ApproveCheck[];
};

// When the tx depends on a token and might require approval for a set of contracts
type TxButtonSetApproveProps<T> = ExternalButtonProps<T> & {
  contractAddress: Address | undefined;
  approveChecks: ERC20ApproveCheck[];
};

export const {
  // ====== ERC-20 ====== //
  ApproveTx,
  MintTx,
  // ====== LTokenSignaler ====== //
  SignalLTokenTx,
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
  StakeTx,
  UnstakeTx,
  GetRewardTx,
  // ====== Wrap ===== //
  DepositAndWrapTx,
  WrapLTokenTx,
  UnwrapLTokenTx,
} = {
  // ====== ERC-20 ====== //
  ApproveTx: (props: TxButtonSetProps<ParamsApprove>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Approve}
      buttonConfig={{
        ...configApprove,
        useMakeInstance: () =>
          configApprove.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  MintTx: (props: TxButtonSetProps<ParamsMint>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Mint}
      buttonConfig={{
        ...configMint,
        useMakeInstance: () =>
          configMint.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  // ====== LTokenSignaler ====== //
  SignalLTokenTx: (props: TxButtonProps<ParamsSignalLToken>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SignalLToken}
      buttonConfig={configSignalLToken}
    />
  ),

  // ====== LToken ====== //
  SetAprTx: (props: TxButtonSetProps<ParamsSetApr>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SetApr}
      buttonConfig={{
        ...configSetApr,
        useMakeInstance: () =>
          configSetApr.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  ClaimFeesTx: (props: TxButtonSetProps<ParamsClaimFees>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.ClaimFees}
      buttonConfig={{
        ...configClaimFees,
        useMakeInstance: () =>
          configClaimFees.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  SetFeesRateTx: (props: TxButtonSetProps<ParamsSetFeesRate>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SetFeesRate}
      buttonConfig={{
        ...configSetFeesRate,
        useMakeInstance: () =>
          configSetFeesRate.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  SetRetentionRateTx: (props: TxButtonSetProps<ParamsSetRetentionRate>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SetRetentionRate}
      buttonConfig={{
        ...configSetRetentionRate,
        useMakeInstance: () =>
          configSetRetentionRate.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  ProcessBigQueuedRequestTx: (
    props: TxButtonSetApproveProps<ParamsProcessBigQueuedRequest>,
  ) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.ProcessBigQueuedRequest}
      buttonConfig={{
        ...configProcessBigQueuedRequest,
        useMakeInstance: () =>
          configProcessBigQueuedRequest.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  ProcessQueuedRequestsTx: (
    props: TxButtonSetProps<ParamsProcessQueuedRequests>,
  ) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.ProcessQueuedRequests}
      buttonConfig={{
        ...configProcessQueuedRequests,
        useMakeInstance: () =>
          configProcessQueuedRequests.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  RepatriateTx: (props: TxButtonSetApproveProps<ParamsRepatriate>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Repatriate}
      buttonConfig={{
        ...configRepatriate,
        useMakeInstance: () =>
          configRepatriate.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  CancelWithdrawalRequestTx: (
    props: TxButtonSetProps<ParamsCancelWithdrawalRequest>,
  ) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.CancelWithdrawalRequest}
      buttonConfig={{
        ...configCancelWithdrawalRequest,
        useMakeInstance: () =>
          configCancelWithdrawalRequest.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  DepositTx: (props: TxButtonSetApproveProps<ParamsDeposit>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Deposit}
      buttonConfig={{
        ...configDeposit,
        useMakeInstance: () =>
          configDeposit.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  InstantWithdrawalTx: (props: TxButtonSetProps<ParamsInstantWithdrawal>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.InstantWithdrawal}
      buttonConfig={{
        ...configInstantWithdrawal,
        useMakeInstance: () =>
          configInstantWithdrawal.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  RequestWithdrawalTx: (props: TxButtonSetProps<ParamsRequestWithdrawal>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.RequestWithdrawal}
      buttonConfig={{
        ...configRequestWithdrawal,
        useMakeInstance: () =>
          configRequestWithdrawal.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  SetFundTx: (props: TxButtonSetProps<ParamsSetFund>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SetFund}
      buttonConfig={{
        ...configSetFund,
        useMakeInstance: () =>
          configSetFund.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  SetLdyStakingTx: (props: TxButtonSetProps<ParamsSetLdyStaking>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SetLdyStaking}
      buttonConfig={{
        ...configSetLdyStaking,
        useMakeInstance: () =>
          configSetLdyStaking.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  SetWithdrawerTx: (props: TxButtonSetProps<ParamsSetWithdrawer>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SetWithdrawer}
      buttonConfig={{
        ...configSetWithdrawer,
        useMakeInstance: () =>
          configSetWithdrawer.useMakeInstance(props.contractAddress),
      }}
    />
  ),

  // ====== GlobalOwner ====== //
  AcceptOwnershipTx: (props: TxButtonProps<ParamsAcceptOwnership>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.AcceptOwnership}
      buttonConfig={configAcceptOwnership}
    />
  ),

  TransferOwnershipTx: (props: TxButtonProps<ParamsTransferOwnership>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.TransferOwnership}
      buttonConfig={configTransferOwnership}
    />
  ),

  // ====== GlobalPause ====== //
  PauseTx: (props: TxButtonProps<ParamsPause>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Pause}
      buttonConfig={configPause}
    />
  ),

  UnpauseTx: (props: TxButtonProps<ParamsUnpause>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Unpause}
      buttonConfig={configUnpause}
    />
  ),

  // ====== PreMining ====== //
  InstantUnlockTx: (props: TxButtonProps<ParamsInstantUnlock>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.InstantUnlock}
      buttonConfig={configInstantUnlock}
    />
  ),

  RequestUnlockTx: (props: TxButtonProps<ParamsRequestUnlock>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.RequestUnlock}
      buttonConfig={configRequestUnlock}
    />
  ),

  // ====== LdyStaking ====== //
  StakeTx: (props: TxButtonApproveProps<ParamsStake>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Stake}
      buttonConfig={configStake}
    />
  ),

  UnstakeTx: (props: TxButtonProps<ParamsUnstake>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Unstake}
      buttonConfig={configUnstake}
    />
  ),

  GetRewardTx: (props: TxButtonProps<ParamsGetReward>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.GetReward}
      buttonConfig={configGetReward}
    />
  ),

  // ====== Wrap ====== //
  DepositAndWrapTx: (props: TxButtonSetApproveProps<ParamsDepositAndWrap>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.DepositAndWrap}
      buttonConfig={{
        ...configDepositAndWrap,
        useMakeInstance: () =>
          configDepositAndWrap.useMakeInstance(props.contractAddress),
      }}
    />
  ),
  WrapLTokenTx: (props: TxButtonSetApproveProps<ParamsWrap>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.WrapLToken}
      buttonConfig={{
        ...configWrap,
        useMakeInstance: () =>
          configWrap.useMakeInstance(props.contractAddress),
      }}
    />
  ),
  UnwrapLTokenTx: (props: TxButtonSetProps<ParamsUnwrap>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.UnwrapLToken}
      buttonConfig={{
        ...configUnwrap,
        useMakeInstance: () =>
          configUnwrap.useMakeInstance(props.contractAddress),
      }}
    />
  ),
} as const;
