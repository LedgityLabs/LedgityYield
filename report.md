**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [divide-before-multiply](#divide-before-multiply) (1 results) (Medium)
 - [reentrancy-no-eth](#reentrancy-no-eth) (1 results) (Medium)
 - [calls-loop](#calls-loop) (2 results) (Low)
 - [timestamp](#timestamp) (2 results) (Low)
 - [costly-loop](#costly-loop) (1 results) (Informational)
## divide-before-multiply
Impact: Medium
Confidence: Medium
 - [ ] ID-0
[Lockdrop.availableToClaim(address)](contracts/src/Lockdrop.sol#L433-L455) performs a multiplication on the result of a division:
	- [elapsedMonthsS3 = (elapsedTimeS3 * 10 ** 3) / ONE_MONTH_IN_SECONDS_S3](contracts/src/Lockdrop.sol#L441)
	- [totalAvailableToClaim = (totalEligibleRewards * elapsedMonthsS3) / rewardsVestingS3](contracts/src/Lockdrop.sol#L445)

contracts/src/Lockdrop.sol#L433-L455


## reentrancy-no-eth
Impact: Medium
Confidence: Medium
 - [ ] ID-1
Reentrancy in [Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L388-L425):
	External calls:
	- [IERC20(address(lToken.underlying())).safeTransfer(unlockAccount,unlockAmount)](contracts/src/Lockdrop.sol#L416)
	State variables written after the call(s):
	- [delete unlockRequests[unlockRequestsCursor]](contracts/src/Lockdrop.sol#L413)
	[Lockdrop.unlockRequests](contracts/src/Lockdrop.sol#L112) can be used in cross function reentrancies:
	- [Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L388-L425)
	- [Lockdrop.requestUnlock()](contracts/src/Lockdrop.sol#L375-L382)
	- [unlockRequestsCursor = processedId](contracts/src/Lockdrop.sol#L424)
	[Lockdrop.unlockRequestsCursor](contracts/src/Lockdrop.sol#L115) can be used in cross function reentrancies:
	- [Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L388-L425)

contracts/src/Lockdrop.sol#L388-L425


## calls-loop
Impact: Low
Confidence: Medium
 - [ ] ID-2
[Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L388-L425) has external calls inside a loop: [lToken.underlying().balanceOf(address(this)) < unlockAmount](contracts/src/Lockdrop.sol#L410)

contracts/src/Lockdrop.sol#L388-L425


 - [ ] ID-3
[Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L388-L425) has external calls inside a loop: [IERC20(address(lToken.underlying())).safeTransfer(unlockAccount,unlockAmount)](contracts/src/Lockdrop.sol#L416)

contracts/src/Lockdrop.sol#L388-L425


## timestamp
Impact: Low
Confidence: Medium
 - [ ] ID-4
[Lockdrop.startRecoveryPhase()](contracts/src/Lockdrop.sol#L221-L244) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(block.timestamp >= claimPhaseStartTimestamp + rewardsVestingInSecond + threeMonthsInSecond,Not enough far from rewards vesting end)](contracts/src/Lockdrop.sol#L229-L233)
	- [require(bool,string)(block.timestamp >= claimPhaseStartTimestamp + maxLockInSecond + threeMonthsInSecond,Not enough far from maximum lock end)](contracts/src/Lockdrop.sol#L237-L240)

contracts/src/Lockdrop.sol#L221-L244


 - [ ] ID-5
[Lockdrop.availableToClaim(address)](contracts/src/Lockdrop.sol#L433-L455) uses timestamp for comparisons
	Dangerous comparisons:
	- [accountsLocks[msg.sender].claimedRewards > totalAvailableToClaim](contracts/src/Lockdrop.sol#L449)

contracts/src/Lockdrop.sol#L433-L455


## costly-loop
Impact: Informational
Confidence: Medium
 - [ ] ID-6
[Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L388-L425) has costly operations inside a loop:
	- [delete unlockRequests[unlockRequestsCursor]](contracts/src/Lockdrop.sol#L413)

contracts/src/Lockdrop.sol#L388-L425


