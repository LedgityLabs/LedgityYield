**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [reentrancy-events](#reentrancy-events) (1 results) (Low)
## reentrancy-events
Impact: Low
Confidence: Medium
 - [ ] ID-0
Reentrancy in [LToken.processQueuedRequests()](contracts/src/LToken.sol#L721-L820):
	External calls:
	- [underlying().safeTransfer(request.account,withdrawnAmount)](contracts/src/LToken.sol#L798)
	Event emitted after the call(s):
	- [ActivityEvent(int256(nextRequestId),request.account,Action.Withdraw,request.amount,withdrawnAmount,Status.Success)](contracts/src/LToken.sol#L780-L787)

contracts/src/LToken.sol#L721-L820


