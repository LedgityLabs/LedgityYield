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
import { Amount, AddressElement } from "@/components/ui";

export const txModalDescriptions = {
  // ====== ERC-20 ====== //
  Approve: (params: ParamsApprove) => (
    <span>
      Allow Ledgity Yield to use{" "}
      <Amount
        value={BigInt(params.amount)}
        decimals={params.tokenDecimals}
        suffix={params.symbol}
        displaySymbol={true}
        className="text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4 whitespace-nowrap"
      />
    </span>
  ),
  Mint: (params: ParamsMint) => <span>Mint new tokens</span>,
  // ====== LTokenSignaler ====== //
  SignalLToken: (params: ParamsSignalLToken) => (
    <span>
      Signal new LToken <AddressElement address={params.lTokenAddress} />
    </span>
  ),
  // ====== LToken ====== //
  SetApr: (params: ParamsSetApr) => (
    <span>Set APR to {(Number(params.newRate) / 100).toFixed(2)}%</span>
  ),
  ClaimFees: (params: ParamsClaimFees) => <span>Claim accumulated fees</span>,
  SetFeesRate: (params: ParamsSetFeesRate) => (
    <span>Set fees rate to {(Number(params.newRate) / 100).toFixed(2)}%</span>
  ),
  SetRetentionRate: (params: ParamsSetRetentionRate) => (
    <span>
      Set retention rate to {(Number(params.newRate) / 100).toFixed(2)}%
    </span>
  ),
  ProcessBigQueuedRequest: (params: ParamsProcessBigQueuedRequest) => (
    <span>Process large withdrawal request #{params.requestId.toString()}</span>
  ),
  ProcessQueuedRequests: (params: ParamsProcessQueuedRequests) => (
    <span>Process pending withdrawal requests</span>
  ),
  Repatriate: (params: ParamsRepatriate) => (
    <span>
      Repatriate{" "}
      <Amount
        value={BigInt(params.amount)}
        decimals={params.tokenDecimals}
        suffix={params.symbol}
        displaySymbol={true}
        className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
      />{" "}
      to fund
    </span>
  ),
  CancelWithdrawalRequest: (params: ParamsCancelWithdrawalRequest) => (
    <span>Cancel pending withdrawal request</span>
  ),
  Deposit: (params: ParamsDeposit) => (
    <span>
      Deposit{" "}
      <Amount
        value={BigInt(params.amount)}
        decimals={params.tokenDecimals}
        suffix={params.symbol}
        displaySymbol={true}
        className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
      />
    </span>
  ),
  InstantWithdrawal: (params: ParamsInstantWithdrawal) => (
    <span>
      Withdraw{" "}
      <Amount
        value={BigInt(params.amount)}
        decimals={params.tokenDecimals}
        suffix={params.symbol}
        displaySymbol={true}
        className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
      />
    </span>
  ),
  RequestWithdrawal: (params: ParamsRequestWithdrawal) => (
    <span>
      Request withdrawal of{" "}
      <Amount
        value={BigInt(params.amount)}
        decimals={params.tokenDecimals}
        suffix={params.symbol}
        displaySymbol={true}
        className="whitespace-nowrap text-indigo-300 underline decoration-indigo-300 decoration-2 underline-offset-4"
      />
    </span>
  ),
  SetFund: (params: ParamsSetFund) => (
    <span>
      Set fund address to <AddressElement address={params.fundAddress} />
    </span>
  ),
  SetLdyStaking: (params: ParamsSetLdyStaking) => (
    <span>
      Set LDY staking contract to{" "}
      <AddressElement address={params.ldyStakingAddress} />
    </span>
  ),
  SetWithdrawer: (params: ParamsSetWithdrawer) => (
    <span>
      Set withdrawer address to{" "}
      <AddressElement address={params.withdrawerAddress} />
    </span>
  ),
  // ====== GlobalOwner ====== //
  AcceptOwnership: (params: ParamsAcceptOwnership) => (
    <span>Accept ownership</span>
  ),
  TransferOwnership: (params: ParamsTransferOwnership) => (
    <span>
      Transfer ownership to <AddressElement address={params.newOwner} />
    </span>
  ),
  // ====== GlobalPause ====== //
  Pause: (params: ParamsPause) => <span>Pause all operations</span>,
  Unpause: (params: ParamsUnpause) => <span>Resume all operations</span>,
  // ====== PreMining ====== //
  InstantUnlock: (params: ParamsInstantUnlock) => "Unlock pre-mining position",
  RequestUnlock: (params: ParamsRequestUnlock) =>
    "Request to unlockpre-mining position (usually takes 3-5 business days)",
  // ====== LdyStaking ====== //
  Stake: (params: ParamsStake) => (
    <span>
      Deposit{" "}
      <Amount
        value={BigInt(params.amount)}
        decimals={params.tokenDecimals}
        suffix={"LDY"}
        displaySymbol={true}
        className="text-indigo-300 underline underline-offset-4 decoration-indigo-300 decoration-2 whitespace-nowrap"
      />{" "}
    </span>
  ),
  Unstake: (params: ParamsUnstake) => (
    <span>
      Withdraw{" "}
      <Amount
        value={BigInt(params.amount)}
        decimals={params.tokenDecimals}
        suffix={"LDY"}
        displaySymbol={true}
        className="text-indigo-300 underline underline-offset-4 decoration-indigo-300 decoration-2 whitespace-nowrap"
      />{" "}
    </span>
  ),
  GetReward: (params: ParamsGetReward) => (
    <span>Claim accumulated LDY rewards from staking</span>
  ),
};
