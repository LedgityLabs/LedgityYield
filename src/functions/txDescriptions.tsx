import {
  // GlobalOwner
  ParamsAcceptOwnership,
  // ERC-20
  ParamsApprove,
  ParamsCancelWithdrawalRequest,
  ParamsClaimFees,
  ParamsDeposit,
  ParamsGetReward,
  // PreMining
  ParamsInstantUnlock,
  ParamsInstantWithdrawal,
  ParamsMint,
  // GlobalPause
  ParamsPause,
  ParamsProcessBigQueuedRequest,
  ParamsProcessQueuedRequests,
  ParamsRepatriate,
  ParamsRequestUnlock,
  ParamsRequestWithdrawal,
  // LToken
  ParamsSetApr,
  ParamsSetFeesRate,
  ParamsSetFund,
  ParamsSetLdyStaking,
  ParamsSetRetentionRate,
  ParamsSetWithdrawer,
  // LTokenSignaler
  ParamsSignalLToken,
  ParamsStake,
  ParamsTransferOwnership,
  ParamsUnpause,
  // LdyStaking
  ParamsUnstake,
} from "@/hooks/contracts";
// Components
import { Amount } from "@/components/ui";

export const txModalDescriptions = {
  // ====== Tokens ====== //
  Stake: (params: ParamsStake) => <></>,
  // ====== ERC-20 ====== //
  Approve: (params: ParamsApprove) => <></>,
  Mint: (params: ParamsMint) => <></>,
  // ====== LTokenSignaler ====== //
  SignalLToken: (params: ParamsSignalLToken) => <></>,
  // ====== LToken ====== //
  SetApr: (params: ParamsSetApr) => <></>,
  ClaimFees: (params: ParamsClaimFees) => <></>,
  SetFeesRate: (params: ParamsSetFeesRate) => <></>,
  SetRetentionRate: (params: ParamsSetRetentionRate) => <></>,
  ProcessBigQueuedRequest: (params: ParamsProcessBigQueuedRequest) => <></>,
  ProcessQueuedRequests: (params: ParamsProcessQueuedRequests) => <></>,
  Repatriate: (params: ParamsRepatriate) => <></>,
  CancelWithdrawalRequest: (params: ParamsCancelWithdrawalRequest) => <></>,
  Deposit: (params: ParamsDeposit) => <></>,
  InstantWithdrawal: (params: ParamsInstantWithdrawal) => <></>,
  RequestWithdrawal: (params: ParamsRequestWithdrawal) => <></>,
  SetFund: (params: ParamsSetFund) => <></>,
  SetLdyStaking: (params: ParamsSetLdyStaking) => <></>,
  SetWithdrawer: (params: ParamsSetWithdrawer) => <></>,
  // ====== GlobalOwner ====== //
  AcceptOwnership: (params: ParamsAcceptOwnership) => <></>,
  TransferOwnership: (params: ParamsTransferOwnership) => <></>,
  // ====== GlobalPause ====== //
  Pause: (params: ParamsPause) => <></>,
  Unpause: (params: ParamsUnpause) => <></>,
  // ====== PreMining ====== //
  InstantUnlock: (params: ParamsInstantUnlock) => <></>,
  RequestUnlock: (params: ParamsRequestUnlock) => <></>,
  // ====== LdyStaking ====== //
  Unstake: (params: ParamsUnstake) => <></>,
  GetReward: (params: ParamsGetReward) => <></>,
};
