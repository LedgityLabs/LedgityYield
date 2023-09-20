**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [reentrancy-no-eth](#reentrancy-no-eth) (1 results) (Medium)
 - [calls-loop](#calls-loop) (1 results) (Low)
 - [timestamp](#timestamp) (2 results) (Low)
 - [costly-loop](#costly-loop) (1 results) (Informational)
## reentrancy-no-eth
Impact: Medium
Confidence: Medium
 - [ ] ID-0
Reentrancy in [PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L381-L415):
	External calls:
	- [underlyingToken.safeTransfer(unlockAccount,unlockAmount)](contracts/src/PreMining.sol#L406)
	State variables written after the call(s):
	- [delete unlockRequests[processedId]](contracts/src/PreMining.sol#L403)
	[PreMining.unlockRequests](contracts/src/PreMining.sol#L108) can be used in cross function reentrancies:
	- [PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L381-L415)
	- [PreMining.requestUnlock()](contracts/src/PreMining.sol#L368-L375)
	- [PreMining.unlockRequests](contracts/src/PreMining.sol#L108)
	- [unlockRequestsCursor = processedId](contracts/src/PreMining.sol#L414)
	[PreMining.unlockRequestsCursor](contracts/src/PreMining.sol#L111) can be used in cross function reentrancies:
	- [PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L381-L415)
	- [PreMining.unlockRequestsCursor](contracts/src/PreMining.sol#L111)

contracts/src/PreMining.sol#L381-L415


## calls-loop
Impact: Low
Confidence: Medium
 - [ ] ID-1
[PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L381-L415) has external calls inside a loop: [underlyingToken.balanceOf(address(this)) < unlockAmount](contracts/src/PreMining.sol#L400)

contracts/src/PreMining.sol#L381-L415


## timestamp
Impact: Low
Confidence: Medium
 - [ ] ID-2
[PreMining.startRecoveryPhase()](contracts/src/PreMining.sol#L224-L255) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(block.timestamp >= afterVestingTimestamp,L80)](contracts/src/PreMining.sol#L240)
	- [require(bool,string)(block.timestamp >= afterMaxLockTimestamp,L81)](contracts/src/PreMining.sol#L251)

contracts/src/PreMining.sol#L224-L255


 - [ ] ID-3
[PreMining.availableToClaim(address)](contracts/src/PreMining.sol#L423-L439) uses timestamp for comparisons
	Dangerous comparisons:
	- [elapsedTime > vestingInSeconds](contracts/src/PreMining.sol#L432)

contracts/src/PreMining.sol#L423-L439


## costly-loop
Impact: Informational
Confidence: Medium
 - [ ] ID-4
[PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L381-L415) has costly operations inside a loop:
	- [delete unlockRequests[processedId]](contracts/src/PreMining.sol#L403)

contracts/src/PreMining.sol#L381-L415


