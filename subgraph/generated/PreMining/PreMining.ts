// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt,
} from "@graphprotocol/graph-ts";

export class Lock extends ethereum.Event {
  get params(): Lock__Params {
    return new Lock__Params(this);
  }
}

export class Lock__Params {
  _event: Lock;

  constructor(event: Lock) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get duration(): i32 {
    return this._event.parameters[2].value.toI32();
  }
}

export class OwnershipTransferStarted extends ethereum.Event {
  get params(): OwnershipTransferStarted__Params {
    return new OwnershipTransferStarted__Params(this);
  }
}

export class OwnershipTransferStarted__Params {
  _event: OwnershipTransferStarted;

  constructor(event: OwnershipTransferStarted) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class OwnershipTransferred extends ethereum.Event {
  get params(): OwnershipTransferred__Params {
    return new OwnershipTransferred__Params(this);
  }
}

export class OwnershipTransferred__Params {
  _event: OwnershipTransferred;

  constructor(event: OwnershipTransferred) {
    this._event = event;
  }

  get previousOwner(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get newOwner(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class Paused extends ethereum.Event {
  get params(): Paused__Params {
    return new Paused__Params(this);
  }
}

export class Paused__Params {
  _event: Paused;

  constructor(event: Paused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class Unpaused extends ethereum.Event {
  get params(): Unpaused__Params {
    return new Unpaused__Params(this);
  }
}

export class Unpaused__Params {
  _event: Unpaused;

  constructor(event: Unpaused) {
    this._event = event;
  }

  get account(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class PreMining__accountsLocksResult {
  value0: BigInt;
  value1: i32;
  value2: boolean;
  value3: BigInt;
  value4: BigInt;

  constructor(
    value0: BigInt,
    value1: i32,
    value2: boolean,
    value3: BigInt,
    value4: BigInt,
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set(
      "value1",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(this.value1)),
    );
    map.set("value2", ethereum.Value.fromBoolean(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromUnsignedBigInt(this.value4));
    return map;
  }

  getAmount(): BigInt {
    return this.value0;
  }

  getDuration(): i32 {
    return this.value1;
  }

  getHasUnlocked(): boolean {
    return this.value2;
  }

  getClaimedRewards(): BigInt {
    return this.value3;
  }

  getLockEndTimestamp(): BigInt {
    return this.value4;
  }
}

export class PreMining extends ethereum.SmartContract {
  static bind(address: Address): PreMining {
    return new PreMining("PreMining", address);
  }

  accountsLocks(param0: Address): PreMining__accountsLocksResult {
    let result = super.call(
      "accountsLocks",
      "accountsLocks(address):(uint240,uint8,bool,uint216,uint40)",
      [ethereum.Value.fromAddress(param0)],
    );

    return new PreMining__accountsLocksResult(
      result[0].toBigInt(),
      result[1].toI32(),
      result[2].toBoolean(),
      result[3].toBigInt(),
      result[4].toBigInt(),
    );
  }

  try_accountsLocks(
    param0: Address,
  ): ethereum.CallResult<PreMining__accountsLocksResult> {
    let result = super.tryCall(
      "accountsLocks",
      "accountsLocks(address):(uint240,uint8,bool,uint216,uint40)",
      [ethereum.Value.fromAddress(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new PreMining__accountsLocksResult(
        value[0].toBigInt(),
        value[1].toI32(),
        value[2].toBoolean(),
        value[3].toBigInt(),
        value[4].toBigInt(),
      ),
    );
  }

  availableToClaim(account: Address): BigInt {
    let result = super.call(
      "availableToClaim",
      "availableToClaim(address):(uint256)",
      [ethereum.Value.fromAddress(account)],
    );

    return result[0].toBigInt();
  }

  try_availableToClaim(account: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "availableToClaim",
      "availableToClaim(address):(uint256)",
      [ethereum.Value.fromAddress(account)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  claimPhaseStartTimestamp(): BigInt {
    let result = super.call(
      "claimPhaseStartTimestamp",
      "claimPhaseStartTimestamp():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_claimPhaseStartTimestamp(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "claimPhaseStartTimestamp",
      "claimPhaseStartTimestamp():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  eligibleRewardsOf(account: Address): BigInt {
    let result = super.call(
      "eligibleRewardsOf",
      "eligibleRewardsOf(address):(uint256)",
      [ethereum.Value.fromAddress(account)],
    );

    return result[0].toBigInt();
  }

  try_eligibleRewardsOf(account: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "eligibleRewardsOf",
      "eligibleRewardsOf(address):(uint256)",
      [ethereum.Value.fromAddress(account)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  hasClaimPhaseStarted(): boolean {
    let result = super.call(
      "hasClaimPhaseStarted",
      "hasClaimPhaseStarted():(bool)",
      [],
    );

    return result[0].toBoolean();
  }

  try_hasClaimPhaseStarted(): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "hasClaimPhaseStarted",
      "hasClaimPhaseStarted():(bool)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  hasDepositPhaseEnded(): boolean {
    let result = super.call(
      "hasDepositPhaseEnded",
      "hasDepositPhaseEnded():(bool)",
      [],
    );

    return result[0].toBoolean();
  }

  try_hasDepositPhaseEnded(): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "hasDepositPhaseEnded",
      "hasDepositPhaseEnded():(bool)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  hasRecoveryPhaseStarted(): boolean {
    let result = super.call(
      "hasRecoveryPhaseStarted",
      "hasRecoveryPhaseStarted():(bool)",
      [],
    );

    return result[0].toBoolean();
  }

  try_hasRecoveryPhaseStarted(): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "hasRecoveryPhaseStarted",
      "hasRecoveryPhaseStarted():(bool)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  lToken(): Address {
    let result = super.call("lToken", "lToken():(address)", []);

    return result[0].toAddress();
  }

  try_lToken(): ethereum.CallResult<Address> {
    let result = super.tryCall("lToken", "lToken():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  ldyToken(): Address {
    let result = super.call("ldyToken", "ldyToken():(address)", []);

    return result[0].toAddress();
  }

  try_ldyToken(): ethereum.CallResult<Address> {
    let result = super.tryCall("ldyToken", "ldyToken():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  lockedHardCap(): BigInt {
    let result = super.call("lockedHardCap", "lockedHardCap():(uint256)", []);

    return result[0].toBigInt();
  }

  try_lockedHardCap(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "lockedHardCap",
      "lockedHardCap():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  maxDistributedLDY(): BigInt {
    let result = super.call(
      "maxDistributedLDY",
      "maxDistributedLDY():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_maxDistributedLDY(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "maxDistributedLDY",
      "maxDistributedLDY():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  maxLockDuration(): i32 {
    let result = super.call("maxLockDuration", "maxLockDuration():(uint8)", []);

    return result[0].toI32();
  }

  try_maxLockDuration(): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "maxLockDuration",
      "maxLockDuration():(uint8)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  maxWeight(): BigInt {
    let result = super.call("maxWeight", "maxWeight():(uint256)", []);

    return result[0].toBigInt();
  }

  try_maxWeight(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("maxWeight", "maxWeight():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  minLockDuration(): i32 {
    let result = super.call("minLockDuration", "minLockDuration():(uint8)", []);

    return result[0].toI32();
  }

  try_minLockDuration(): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "minLockDuration",
      "minLockDuration():(uint8)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }

  owner(): Address {
    let result = super.call("owner", "owner():(address)", []);

    return result[0].toAddress();
  }

  try_owner(): ethereum.CallResult<Address> {
    let result = super.tryCall("owner", "owner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  paused(): boolean {
    let result = super.call("paused", "paused():(bool)", []);

    return result[0].toBoolean();
  }

  try_paused(): ethereum.CallResult<boolean> {
    let result = super.tryCall("paused", "paused():(bool)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  pendingOwner(): Address {
    let result = super.call("pendingOwner", "pendingOwner():(address)", []);

    return result[0].toAddress();
  }

  try_pendingOwner(): ethereum.CallResult<Address> {
    let result = super.tryCall("pendingOwner", "pendingOwner():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  totalLocked(): BigInt {
    let result = super.call("totalLocked", "totalLocked():(uint256)", []);

    return result[0].toBigInt();
  }

  try_totalLocked(): ethereum.CallResult<BigInt> {
    let result = super.tryCall("totalLocked", "totalLocked():(uint256)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  underlyingToken(): Address {
    let result = super.call(
      "underlyingToken",
      "underlyingToken():(address)",
      [],
    );

    return result[0].toAddress();
  }

  try_underlyingToken(): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "underlyingToken",
      "underlyingToken():(address)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  unlockRequests(param0: BigInt): Address {
    let result = super.call(
      "unlockRequests",
      "unlockRequests(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)],
    );

    return result[0].toAddress();
  }

  try_unlockRequests(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall(
      "unlockRequests",
      "unlockRequests(uint256):(address)",
      [ethereum.Value.fromUnsignedBigInt(param0)],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  unlockRequestsCursor(): BigInt {
    let result = super.call(
      "unlockRequestsCursor",
      "unlockRequestsCursor():(uint256)",
      [],
    );

    return result[0].toBigInt();
  }

  try_unlockRequestsCursor(): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "unlockRequestsCursor",
      "unlockRequestsCursor():(uint256)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  vestingDuration(): i32 {
    let result = super.call("vestingDuration", "vestingDuration():(uint8)", []);

    return result[0].toI32();
  }

  try_vestingDuration(): ethereum.CallResult<i32> {
    let result = super.tryCall(
      "vestingDuration",
      "vestingDuration():(uint8)",
      [],
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toI32());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get lTokenAddress_(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get maxDistributedLDY_(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get lockedHardCap_(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get minLockDuration_(): i32 {
    return this._call.inputValues[3].value.toI32();
  }

  get maxLockDuration_(): i32 {
    return this._call.inputValues[4].value.toI32();
  }

  get vestingDuration_(): i32 {
    return this._call.inputValues[5].value.toI32();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AcceptOwnershipCall extends ethereum.Call {
  get inputs(): AcceptOwnershipCall__Inputs {
    return new AcceptOwnershipCall__Inputs(this);
  }

  get outputs(): AcceptOwnershipCall__Outputs {
    return new AcceptOwnershipCall__Outputs(this);
  }
}

export class AcceptOwnershipCall__Inputs {
  _call: AcceptOwnershipCall;

  constructor(call: AcceptOwnershipCall) {
    this._call = call;
  }
}

export class AcceptOwnershipCall__Outputs {
  _call: AcceptOwnershipCall;

  constructor(call: AcceptOwnershipCall) {
    this._call = call;
  }
}

export class ClaimRewardsCall extends ethereum.Call {
  get inputs(): ClaimRewardsCall__Inputs {
    return new ClaimRewardsCall__Inputs(this);
  }

  get outputs(): ClaimRewardsCall__Outputs {
    return new ClaimRewardsCall__Outputs(this);
  }
}

export class ClaimRewardsCall__Inputs {
  _call: ClaimRewardsCall;

  constructor(call: ClaimRewardsCall) {
    this._call = call;
  }
}

export class ClaimRewardsCall__Outputs {
  _call: ClaimRewardsCall;

  constructor(call: ClaimRewardsCall) {
    this._call = call;
  }
}

export class EndDepositPhaseCall extends ethereum.Call {
  get inputs(): EndDepositPhaseCall__Inputs {
    return new EndDepositPhaseCall__Inputs(this);
  }

  get outputs(): EndDepositPhaseCall__Outputs {
    return new EndDepositPhaseCall__Outputs(this);
  }
}

export class EndDepositPhaseCall__Inputs {
  _call: EndDepositPhaseCall;

  constructor(call: EndDepositPhaseCall) {
    this._call = call;
  }
}

export class EndDepositPhaseCall__Outputs {
  _call: EndDepositPhaseCall;

  constructor(call: EndDepositPhaseCall) {
    this._call = call;
  }
}

export class InstantUnlockCall extends ethereum.Call {
  get inputs(): InstantUnlockCall__Inputs {
    return new InstantUnlockCall__Inputs(this);
  }

  get outputs(): InstantUnlockCall__Outputs {
    return new InstantUnlockCall__Outputs(this);
  }
}

export class InstantUnlockCall__Inputs {
  _call: InstantUnlockCall;

  constructor(call: InstantUnlockCall) {
    this._call = call;
  }
}

export class InstantUnlockCall__Outputs {
  _call: InstantUnlockCall;

  constructor(call: InstantUnlockCall) {
    this._call = call;
  }
}

export class LockCall extends ethereum.Call {
  get inputs(): LockCall__Inputs {
    return new LockCall__Inputs(this);
  }

  get outputs(): LockCall__Outputs {
    return new LockCall__Outputs(this);
  }
}

export class LockCall__Inputs {
  _call: LockCall;

  constructor(call: LockCall) {
    this._call = call;
  }

  get amount(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get duration(): i32 {
    return this._call.inputValues[1].value.toI32();
  }
}

export class LockCall__Outputs {
  _call: LockCall;

  constructor(call: LockCall) {
    this._call = call;
  }
}

export class PauseCall extends ethereum.Call {
  get inputs(): PauseCall__Inputs {
    return new PauseCall__Inputs(this);
  }

  get outputs(): PauseCall__Outputs {
    return new PauseCall__Outputs(this);
  }
}

export class PauseCall__Inputs {
  _call: PauseCall;

  constructor(call: PauseCall) {
    this._call = call;
  }
}

export class PauseCall__Outputs {
  _call: PauseCall;

  constructor(call: PauseCall) {
    this._call = call;
  }
}

export class ProcessUnlockRequestsCall extends ethereum.Call {
  get inputs(): ProcessUnlockRequestsCall__Inputs {
    return new ProcessUnlockRequestsCall__Inputs(this);
  }

  get outputs(): ProcessUnlockRequestsCall__Outputs {
    return new ProcessUnlockRequestsCall__Outputs(this);
  }
}

export class ProcessUnlockRequestsCall__Inputs {
  _call: ProcessUnlockRequestsCall;

  constructor(call: ProcessUnlockRequestsCall) {
    this._call = call;
  }
}

export class ProcessUnlockRequestsCall__Outputs {
  _call: ProcessUnlockRequestsCall;

  constructor(call: ProcessUnlockRequestsCall) {
    this._call = call;
  }
}

export class RecoverERC20Call extends ethereum.Call {
  get inputs(): RecoverERC20Call__Inputs {
    return new RecoverERC20Call__Inputs(this);
  }

  get outputs(): RecoverERC20Call__Outputs {
    return new RecoverERC20Call__Outputs(this);
  }
}

export class RecoverERC20Call__Inputs {
  _call: RecoverERC20Call;

  constructor(call: RecoverERC20Call) {
    this._call = call;
  }

  get tokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get amount(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class RecoverERC20Call__Outputs {
  _call: RecoverERC20Call;

  constructor(call: RecoverERC20Call) {
    this._call = call;
  }
}

export class RenounceOwnershipCall extends ethereum.Call {
  get inputs(): RenounceOwnershipCall__Inputs {
    return new RenounceOwnershipCall__Inputs(this);
  }

  get outputs(): RenounceOwnershipCall__Outputs {
    return new RenounceOwnershipCall__Outputs(this);
  }
}

export class RenounceOwnershipCall__Inputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RenounceOwnershipCall__Outputs {
  _call: RenounceOwnershipCall;

  constructor(call: RenounceOwnershipCall) {
    this._call = call;
  }
}

export class RequestUnlockCall extends ethereum.Call {
  get inputs(): RequestUnlockCall__Inputs {
    return new RequestUnlockCall__Inputs(this);
  }

  get outputs(): RequestUnlockCall__Outputs {
    return new RequestUnlockCall__Outputs(this);
  }
}

export class RequestUnlockCall__Inputs {
  _call: RequestUnlockCall;

  constructor(call: RequestUnlockCall) {
    this._call = call;
  }
}

export class RequestUnlockCall__Outputs {
  _call: RequestUnlockCall;

  constructor(call: RequestUnlockCall) {
    this._call = call;
  }
}

export class SetLDYTokenCall extends ethereum.Call {
  get inputs(): SetLDYTokenCall__Inputs {
    return new SetLDYTokenCall__Inputs(this);
  }

  get outputs(): SetLDYTokenCall__Outputs {
    return new SetLDYTokenCall__Outputs(this);
  }
}

export class SetLDYTokenCall__Inputs {
  _call: SetLDYTokenCall;

  constructor(call: SetLDYTokenCall) {
    this._call = call;
  }

  get ldyTokenAddress(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetLDYTokenCall__Outputs {
  _call: SetLDYTokenCall;

  constructor(call: SetLDYTokenCall) {
    this._call = call;
  }
}

export class StartClaimPhaseCall extends ethereum.Call {
  get inputs(): StartClaimPhaseCall__Inputs {
    return new StartClaimPhaseCall__Inputs(this);
  }

  get outputs(): StartClaimPhaseCall__Outputs {
    return new StartClaimPhaseCall__Outputs(this);
  }
}

export class StartClaimPhaseCall__Inputs {
  _call: StartClaimPhaseCall;

  constructor(call: StartClaimPhaseCall) {
    this._call = call;
  }
}

export class StartClaimPhaseCall__Outputs {
  _call: StartClaimPhaseCall;

  constructor(call: StartClaimPhaseCall) {
    this._call = call;
  }
}

export class StartRecoveryPhaseCall extends ethereum.Call {
  get inputs(): StartRecoveryPhaseCall__Inputs {
    return new StartRecoveryPhaseCall__Inputs(this);
  }

  get outputs(): StartRecoveryPhaseCall__Outputs {
    return new StartRecoveryPhaseCall__Outputs(this);
  }
}

export class StartRecoveryPhaseCall__Inputs {
  _call: StartRecoveryPhaseCall;

  constructor(call: StartRecoveryPhaseCall) {
    this._call = call;
  }
}

export class StartRecoveryPhaseCall__Outputs {
  _call: StartRecoveryPhaseCall;

  constructor(call: StartRecoveryPhaseCall) {
    this._call = call;
  }
}

export class TransferOwnershipCall extends ethereum.Call {
  get inputs(): TransferOwnershipCall__Inputs {
    return new TransferOwnershipCall__Inputs(this);
  }

  get outputs(): TransferOwnershipCall__Outputs {
    return new TransferOwnershipCall__Outputs(this);
  }
}

export class TransferOwnershipCall__Inputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }

  get newOwner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class TransferOwnershipCall__Outputs {
  _call: TransferOwnershipCall;

  constructor(call: TransferOwnershipCall) {
    this._call = call;
  }
}

export class UnpauseCall extends ethereum.Call {
  get inputs(): UnpauseCall__Inputs {
    return new UnpauseCall__Inputs(this);
  }

  get outputs(): UnpauseCall__Outputs {
    return new UnpauseCall__Outputs(this);
  }
}

export class UnpauseCall__Inputs {
  _call: UnpauseCall;

  constructor(call: UnpauseCall) {
    this._call = call;
  }
}

export class UnpauseCall__Outputs {
  _call: UnpauseCall;

  constructor(call: UnpauseCall) {
    this._call = call;
  }
}
