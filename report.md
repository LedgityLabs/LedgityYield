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
      Reentrancy in [PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L411-L445):
      External calls: - [underlyingToken.safeTransfer(unlockAccount,unlockAmount)](contracts/src/PreMining.sol#L436)
      State variables written after the call(s): - [delete unlockRequests[processedId]](contracts/src/PreMining.sol#L433)
      [PreMining.unlockRequests](contracts/src/PreMining.sol#L115) can be used in cross function reentrancies: - [PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L411-L445) - [PreMining.requestUnlock()](contracts/src/PreMining.sol#L398-L405) - [PreMining.unlockRequests](contracts/src/PreMining.sol#L115) - [unlockRequestsCursor = processedId](contracts/src/PreMining.sol#L444)
      [PreMining.unlockRequestsCursor](contracts/src/PreMining.sol#L118) can be used in cross function reentrancies: - [PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L411-L445) - [PreMining.unlockRequestsCursor](contracts/src/PreMining.sol#L118)

contracts/src/PreMining.sol#L411-L445

## calls-loop

Impact: Low
Confidence: Medium

- [ ] ID-1
      [PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L411-L445) has external calls inside a loop: [underlyingToken.balanceOf(address(this)) < unlockAmount](contracts/src/PreMining.sol#L430)

contracts/src/PreMining.sol#L411-L445

## timestamp

Impact: Low
Confidence: Medium

- [ ] ID-2
      [PreMining.availableToClaim(address)](contracts/src/PreMining.sol#L453-L469) uses timestamp for comparisons
      Dangerous comparisons: - [elapsedTime > vestingInSeconds](contracts/src/PreMining.sol#L462)

contracts/src/PreMining.sol#L453-L469

- [ ] ID-3
      [PreMining.startRecoveryPhase()](contracts/src/PreMining.sol#L236-L267) uses timestamp for comparisons
      Dangerous comparisons: - [require(bool,string)(block.timestamp >= afterVestingTimestamp,L80)](contracts/src/PreMining.sol#L252) - [require(bool,string)(block.timestamp >= afterMaxLockTimestamp,L81)](contracts/src/PreMining.sol#L263)

contracts/src/PreMining.sol#L236-L267

## costly-loop

Impact: Informational
Confidence: Medium

- [ ] ID-4
      [PreMining.processUnlockRequests()](contracts/src/PreMining.sol#L411-L445) has costly operations inside a loop: - [delete unlockRequests[processedId]](contracts/src/PreMining.sol#L433)

contracts/src/PreMining.sol#L411-L445

## immutable-states

Impact: Optimization
Confidence: High

- [ ] ID-5
      [PreMining.underlyingToken](contracts/src/PreMining.sol#L91) should be immutable

contracts/src/PreMining.sol#L91
