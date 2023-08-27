**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [reentrancy-no-eth](#reentrancy-no-eth) (1 results) (Medium)
 - [calls-loop](#calls-loop) (1 results) (Low)
 - [timestamp](#timestamp) (2 results) (Low)
 - [costly-loop](#costly-loop) (1 results) (Informational)
 - [immutable-states](#immutable-states) (1 results) (Optimization)
## reentrancy-no-eth
Impact: Medium
Confidence: Medium
 - [ ] ID-0
Reentrancy in [Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L411-L445):
	External calls:
	- [underlyingToken.safeTransfer(unlockAccount,unlockAmount)](contracts/src/Lockdrop.sol#L436)
	State variables written after the call(s):
	- [delete unlockRequests[processedId]](contracts/src/Lockdrop.sol#L433)
	[Lockdrop.unlockRequests](contracts/src/Lockdrop.sol#L115) can be used in cross function reentrancies:
	- [Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L411-L445)
	- [Lockdrop.requestUnlock()](contracts/src/Lockdrop.sol#L398-L405)
	- [Lockdrop.unlockRequests](contracts/src/Lockdrop.sol#L115)
	- [unlockRequestsCursor = processedId](contracts/src/Lockdrop.sol#L444)
	[Lockdrop.unlockRequestsCursor](contracts/src/Lockdrop.sol#L118) can be used in cross function reentrancies:
	- [Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L411-L445)
	- [Lockdrop.unlockRequestsCursor](contracts/src/Lockdrop.sol#L118)

contracts/src/Lockdrop.sol#L411-L445


## calls-loop
Impact: Low
Confidence: Medium
 - [ ] ID-1
[Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L411-L445) has external calls inside a loop: [underlyingToken.balanceOf(address(this)) < unlockAmount](contracts/src/Lockdrop.sol#L430)

contracts/src/Lockdrop.sol#L411-L445


## timestamp
Impact: Low
Confidence: Medium
 - [ ] ID-2
[Lockdrop.availableToClaim(address)](contracts/src/Lockdrop.sol#L453-L469) uses timestamp for comparisons
	Dangerous comparisons:
	- [elapsedTime > vestingInSeconds](contracts/src/Lockdrop.sol#L462)

contracts/src/Lockdrop.sol#L453-L469


 - [ ] ID-3
[Lockdrop.startRecoveryPhase()](contracts/src/Lockdrop.sol#L236-L267) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(block.timestamp >= afterVestingTimestamp,L80)](contracts/src/Lockdrop.sol#L252)
	- [require(bool,string)(block.timestamp >= afterMaxLockTimestamp,L81)](contracts/src/Lockdrop.sol#L263)

contracts/src/Lockdrop.sol#L236-L267


## costly-loop
Impact: Informational
Confidence: Medium
 - [ ] ID-4
[Lockdrop.processUnlockRequests()](contracts/src/Lockdrop.sol#L411-L445) has costly operations inside a loop:
	- [delete unlockRequests[processedId]](contracts/src/Lockdrop.sol#L433)

contracts/src/Lockdrop.sol#L411-L445


## immutable-states
Impact: Optimization
Confidence: High
 - [ ] ID-5
[Lockdrop.underlyingToken](contracts/src/Lockdrop.sol#L91) should be immutable 

contracts/src/Lockdrop.sol#L91


