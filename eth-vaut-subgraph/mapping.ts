import { BigInt } from "@graphprotocol/graph-ts"
import { UserDeposit, UserWithdraw, UserRewardClaim } from "./generated/EthVault/EthVault"
import { User, UserAction, EpochInvestment } from "./generated/schema"

function getOrCreateUser(userId: string): User {
  let user = User.load(userId)
  if (!user) {
    user = new User(userId)
    user.totalDeposited = BigInt.fromI32(0)
    user.totalWithdrawn = BigInt.fromI32(0)
    user.totalRewardsClaimed = BigInt.fromI32(0)
    user.save()
  }
  return user as User
}

function getOrCreateEpochInvestment(userId: string, epochNumber: i32): EpochInvestment {
  let id = userId + "-" + epochNumber.toString()
  let epochInvestment = EpochInvestment.load(id)
  if (!epochInvestment) {
    epochInvestment = new EpochInvestment(id)
    epochInvestment.user = userId
    epochInvestment.epochNumber = epochNumber
    epochInvestment.amount = BigInt.fromI32(0)
  }
  return epochInvestment as EpochInvestment
}

function createUserDepositAction(user: User, epochNumber: i32, amount: BigInt, event: UserDeposit): void {
  let actionId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let action = new UserAction(actionId)
  action.user = user.id
  action.epochNumber = epochNumber
  action.amount = amount
  action.actionType = "DEPOSIT"
  action.timestamp = event.block.timestamp
  action.save()
}

function createUserWithdrawAction(user: User, epochNumber: i32, amount: BigInt, event: UserWithdraw): void {
  let actionId = event.transaction.hash.toHex() + "-" + event.logIndex.toString()
  let action = new UserAction(actionId)
  action.user = user.id
  action.epochNumber = epochNumber
  action.amount = amount
  action.actionType = "WITHDRAW"
  action.timestamp = event.block.timestamp
  action.save()
}

function updateEpochInvestments(userId: string, currentEpochNumber: i32, amount: BigInt): void {
  for (let i = currentEpochNumber; i > 0; i--) {
    let epochInvestment = getOrCreateEpochInvestment(userId, i)
    epochInvestment.amount = epochInvestment.amount.plus(amount)
    if (epochInvestment.amount.lt(BigInt.fromI32(0))) {
      epochInvestment.amount = BigInt.fromI32(0)
    }
    epochInvestment.save()
  }
}

export function handleUserDeposit(event: UserDeposit): void {
  let user = getOrCreateUser(event.params.user.toHex())
  user.totalDeposited = user.totalDeposited.plus(event.params.amount)
  user.save()

  createUserDepositAction(user, event.params.epochNumber.toI32(), event.params.amount, event)
  updateEpochInvestments(user.id, event.params.epochNumber.toI32(), event.params.amount)
}

export function handleUserWithdraw(event: UserWithdraw): void {
  let user = getOrCreateUser(event.params.user.toHex())
  user.totalWithdrawn = user.totalWithdrawn.plus(event.params.amount)
  user.save()

  createUserWithdrawAction(user, event.params.epochNumber.toI32(), event.params.amount, event)
  updateEpochInvestments(user.id, event.params.epochNumber.toI32(), event.params.amount.neg())
}

export function handleUserRewardClaim(event: UserRewardClaim): void {
  let user = getOrCreateUser(event.params.user.toHex())
  user.totalRewardsClaimed = user.totalRewardsClaimed.plus(event.params.amount)
  user.save()
}