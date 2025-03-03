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
import { txModalDescriptions } from "@/functions/txDescriptions";

// Create a utility type just for the params property
type OptionalParams<T> =
  T extends Record<string, never> ? { params?: T } : { params: T };

// Create a utility for external button props exposed in the implementations
type ExternalButtonProps<T> = Omit<
  TxButtonWrapperProps<T>,
  "buttonConfig" | "makeDescription"
>;

// When the tx interacts with a contract without token dependencies
type TxButtonProps<T> = ExternalButtonProps<T> & OptionalParams<T>;

// When the tx interacts with a contract without token dependencies
type TxButtonSetProps<T> = ExternalButtonProps<T> &
  OptionalParams<T> & { contractAddress: Address };

// When the tx interacts directly with a token
type TxTokenButtonProps<T> = ExternalButtonProps<T> &
  OptionalParams<T> & { tokenAddress: Address };

// When the tx depends on a token and might require approval
type TxButtonApproveProps<T> = ExternalButtonProps<T> &
  OptionalParams<T> & { approveChecks: ERC20ApproveCheck[] };

// When the tx depends on a token and might require approval for a set of contracts
type TxButtonSetApproveProps<T> = ExternalButtonProps<T> &
  OptionalParams<T> & {
    contractAddress: Address;
    approveChecks: ERC20ApproveCheck[];
  };

export const {
  // ====== Tokens ====== //
  StakeTx,
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
  UnstakeTx,
  GetRewardTx,
} = {
  // ====== Tokens ====== //
  StakeTx: (props: TxButtonApproveProps<ParamsStake>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Stake}
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
      makeDescription={txModalDescriptions.Approve}
      buttonConfig={{
        ...configApprove,
        makeInstance: () => configApprove.makeInstance(props.tokenAddress),
      }}
    />
  ),

  MintTx: (props: TxTokenButtonProps<ParamsMint>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.Mint}
      buttonConfig={{
        ...configMint,
        makeInstance: () => configMint.makeInstance(props.tokenAddress),
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
  SetAprTx: (props: TxButtonSetApproveProps<ParamsSetApr>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SetApr}
      buttonConfig={{
        ...configSetApr,
        makeInstance: () => configSetApr.makeInstance(props.contractAddress),
      }}
    />
  ),

  ClaimFeesTx: (props: TxButtonSetProps<ParamsClaimFees>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.ClaimFees}
      buttonConfig={{
        ...configClaimFees,
        makeInstance: () => configClaimFees.makeInstance(props.contractAddress),
      }}
    />
  ),

  SetFeesRateTx: (props: TxButtonSetProps<ParamsSetFeesRate>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SetFeesRate}
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
      makeDescription={txModalDescriptions.SetRetentionRate}
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
      makeDescription={txModalDescriptions.ProcessBigQueuedRequest}
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
      makeDescription={txModalDescriptions.ProcessQueuedRequests}
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
      makeDescription={txModalDescriptions.Repatriate}
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
      makeDescription={txModalDescriptions.CancelWithdrawalRequest}
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
      makeDescription={txModalDescriptions.Deposit}
      buttonConfig={{
        ...configDeposit,
        makeInstance: () => configDeposit.makeInstance(props.contractAddress),
      }}
    />
  ),

  InstantWithdrawalTx: (props: TxButtonSetProps<ParamsInstantWithdrawal>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.InstantWithdrawal}
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
      makeDescription={txModalDescriptions.RequestWithdrawal}
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
      makeDescription={txModalDescriptions.SetFund}
      buttonConfig={{
        ...configSetFund,
        makeInstance: () => configSetFund.makeInstance(props.contractAddress),
      }}
    />
  ),

  SetLdyStakingTx: (props: TxButtonSetProps<ParamsSetLdyStaking>) => (
    <TxButtonWrapper
      {...props}
      makeDescription={txModalDescriptions.SetLdyStaking}
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
      makeDescription={txModalDescriptions.SetWithdrawer}
      buttonConfig={{
        ...configSetWithdrawer,
        makeInstance: () =>
          configSetWithdrawer.makeInstance(props.contractAddress),
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
} as const;
