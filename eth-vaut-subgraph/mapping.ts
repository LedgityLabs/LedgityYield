import { BigInt } from "@graphprotocol/graph-ts"
import { UserDeposit, UserWithdraw, UserRewardClaim } from "./generated/EthVault/EthVault"
import { User, Stake, Epoch } from "./generated/schema"

export function handleUserDeposit(event: UserDeposit): void {
  let user = User.load(event.params.user.toHex())
  if (!user) {
    user = new User(event.params.user.toHex())
    user.totalDeposited = BigInt.fromI32(0)
    user.totalWithdrawn = BigInt.fromI32(0)
    user.totalRewardsClaimed = BigInt.fromI32(0)
  }

  user.totalDeposited = user.totalDeposited.plus(event.params.amount)

  let stake = new Stake(event.transaction.hash.toHex())
  stake.user = user.id
  stake.amount = event.params.amount
  stake.epochNumber = event.params.epochNumber.toI32()
  stake.save()

  user.save()
}

export function handleUserWithdraw(event: UserWithdraw): void {
  let user = User.load(event.params.user.toHex())
  if (user) {
    user.totalWithdrawn = user.totalWithdrawn.plus(event.params.amount)
    user.save()
  }
}

export function handleUserRewardClaim(event: UserRewardClaim): void {
  let user = User.load(event.params.user.toHex())
  if (user) {
    user.totalRewardsClaimed = user.totalRewardsClaimed.plus(event.params.amount)
    user.save()
  }
}
