**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [divide-before-multiply](#divide-before-multiply) (1 results) (Medium)
 - [events-access](#events-access) (2 results) (Low)
 - [events-maths](#events-maths) (4 results) (Low)
 - [calls-loop](#calls-loop) (1 results) (Low)
 - [reentrancy-events](#reentrancy-events) (2 results) (Low)
 - [timestamp](#timestamp) (4 results) (Low)
 - [costly-loop](#costly-loop) (3 results) (Informational)
 - [low-level-calls](#low-level-calls) (1 results) (Informational)
 - [naming-convention](#naming-convention) (1 results) (Informational)
 - [redundant-statements](#redundant-statements) (4 results) (Informational)
## divide-before-multiply
Impact: Medium
Confidence: Medium
 - [ ] ID-0
[LDYStaking.earned(address,uint256)](contracts/src/LDYStaking.sol#L409-L416) performs a multiplication on the result of a division:
	- [weightedAmount = (userInfo.stakedAmount * multiplier) / MULTIPLIER_BASIS](contracts/src/LDYStaking.sol#L412)
	- [rewardsSinceLastUpdate = ((weightedAmount * (rewardPerToken() - userInfo.rewardPerTokenPaid)) / 1e18)](contracts/src/LDYStaking.sol#L413-L414)

contracts/src/LDYStaking.sol#L409-L416


## events-access
Impact: Low
Confidence: Medium
 - [ ] ID-1
[LToken.setWithdrawer(address)](contracts/src/LToken.sol#L300-L306) should emit an event for: 
	- [withdrawer = withdrawer_](contracts/src/LToken.sol#L305) 

contracts/src/LToken.sol#L300-L306


 - [ ] ID-2
[LToken.setFund(address)](contracts/src/LToken.sol#L312-L318) should emit an event for: 
	- [fund = fund_](contracts/src/LToken.sol#L317) 

contracts/src/LToken.sol#L312-L318


## events-maths
Impact: Low
Confidence: Medium
 - [ ] ID-3
[LToken.setRetentionRate(uint32)](contracts/src/LToken.sol#L283-L286) should emit an event for: 
	- [retentionRateUD7x3 = retentionRateUD7x3_](contracts/src/LToken.sol#L285) 

contracts/src/LToken.sol#L283-L286


 - [ ] ID-4
[LDYStaking.setStakeAmountForPerks(uint256)](contracts/src/LDYStaking.sol#L304-L306) should emit an event for: 
	- [stakeAmountForPerks = stakeAmountForPerks_](contracts/src/LDYStaking.sol#L305) 

contracts/src/LDYStaking.sol#L304-L306


 - [ ] ID-5
[LToken.setFeesRate(uint32)](contracts/src/LToken.sol#L272-L275) should emit an event for: 
	- [feesRateUD7x3 = feesRateUD7x3_](contracts/src/LToken.sol#L274) 

contracts/src/LToken.sol#L272-L275


 - [ ] ID-6
[LDYStaking.setStakeDurationForPerks(uint256)](contracts/src/LDYStaking.sol#L295-L297) should emit an event for: 
	- [stakeDurationForPerks = stakeDurationForPerks_](contracts/src/LDYStaking.sol#L296) 

contracts/src/LDYStaking.sol#L295-L297


## calls-loop
Impact: Low
Confidence: Medium
 - [ ] ID-7
[LToken.getWithdrawnAmountAndFees(address,uint256)](contracts/src/LToken.sol#L603-L621) has external calls inside a loop: [ldyStaking.tierOf(account) >= 2](contracts/src/LToken.sol#L608)

contracts/src/LToken.sol#L603-L621


## reentrancy-events
Impact: Low
Confidence: Medium
 - [ ] ID-8
Reentrancy in [LDYStaking.notifyRewardAmount(uint256)](contracts/src/LDYStaking.sol#L346-L374):
	External calls:
	- [stakeRewardToken.safeTransferFrom(_msgSender(),address(this),amount)](contracts/src/LDYStaking.sol#L371)
	Event emitted after the call(s):
	- [NotifiedRewardAmount(amount,rewardRatePerSec)](contracts/src/LDYStaking.sol#L373)

contracts/src/LDYStaking.sol#L346-L374


 - [ ] ID-9
Reentrancy in [LToken.processQueuedRequests()](contracts/src/LToken.sol#L740-L851):
	External calls:
	- [underlying().safeTransfer(request.account,withdrawnAmount)](contracts/src/LToken.sol#L829)
	Event emitted after the call(s):
	- [ActivityEvent(int256(nextRequestId),_msgSender(),Action.Withdraw,request.amount,request.amount,Status.Moved,int256(withdrawalQueue.length))](contracts/src/LToken.sol#L777-L785)
	- [ActivityEvent(int256(nextRequestId),request.account,Action.Withdraw,request.amount,withdrawnAmount,Status.Success,NO_ID)](contracts/src/LToken.sol#L810-L818)

contracts/src/LToken.sol#L740-L851


## timestamp
Impact: Low
Confidence: Medium
 - [ ] ID-10
[LDYStaking.unstake(uint256,uint256)](contracts/src/LDYStaking.sol#L218-L263) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(block.timestamp >= userStakingInfo[_msgSender()][stakeIndex].unStakeAt,Cannot unstake during staking period)](contracts/src/LDYStaking.sol#L224-L227)

contracts/src/LDYStaking.sol#L218-L263


 - [ ] ID-11
[LDYStaking.notifyRewardAmount(uint256)](contracts/src/LDYStaking.sol#L346-L374) uses timestamp for comparisons
	Dangerous comparisons:
	- [block.timestamp >= finishAt](contracts/src/LDYStaking.sol#L352)
	- [require(bool,string)(rewardRatePerSec > 0,reward rate = 0)](contracts/src/LDYStaking.sol#L359)
	- [require(bool,string)(rewardRatePerSec <= (stakeRewardToken.balanceOf(address(this)) + amount - totalStaked) / rewardsDuration,reward amount > balance)](contracts/src/LDYStaking.sol#L360-L365)

contracts/src/LDYStaking.sol#L346-L374


 - [ ] ID-12
[LDYStaking.setRewardsDuration(uint256)](contracts/src/LDYStaking.sol#L285-L288) uses timestamp for comparisons
	Dangerous comparisons:
	- [require(bool,string)(finishAt < block.timestamp,reward duration is not finished)](contracts/src/LDYStaking.sol#L286)

contracts/src/LDYStaking.sol#L285-L288


 - [ ] ID-13
[LDYStaking._min(uint256,uint256)](contracts/src/LDYStaking.sol#L513-L515) uses timestamp for comparisons
	Dangerous comparisons:
	- [x <= y](contracts/src/LDYStaking.sol#L514)

contracts/src/LDYStaking.sol#L513-L515


## costly-loop
Impact: Informational
Confidence: Medium
 - [ ] ID-14
[LToken.processQueuedRequests()](contracts/src/LToken.sol#L740-L851) has costly operations inside a loop:
	- [delete withdrawalQueue[nextRequestId]](contracts/src/LToken.sol#L767)

contracts/src/LToken.sol#L740-L851


 - [ ] ID-15
[LToken.processQueuedRequests()](contracts/src/LToken.sol#L740-L851) has costly operations inside a loop:
	- [delete withdrawalQueue[nextRequestId]](contracts/src/LToken.sol#L821)

contracts/src/LToken.sol#L740-L851


 - [ ] ID-16
[LToken.processQueuedRequests()](contracts/src/LToken.sol#L740-L851) has costly operations inside a loop:
	- [delete withdrawalQueue[nextRequestId]](contracts/src/LToken.sol#L788)

contracts/src/LToken.sol#L740-L851


## low-level-calls
Impact: Informational
Confidence: High
 - [ ] ID-17
Low level call in [LToken.requestWithdrawal(uint256)](contracts/src/LToken.sol#L679-L733):
	- [(sent) = withdrawer.call{value: msg.value}()](contracts/src/LToken.sol#L731)

contracts/src/LToken.sol#L679-L733


## naming-convention
Impact: Informational
Confidence: High
 - [ ] ID-18
Constant [LToken.MAX_FEES_RATE_UD7x3](contracts/src/LToken.sol#L89) is not in UPPER_CASE_WITH_UNDERSCORES

contracts/src/LToken.sol#L89


## redundant-statements
Impact: Informational
Confidence: High
 - [ ] ID-19
Redundant expression "[amount](contracts/src/LToken.sol#L553)" in[LToken](contracts/src/LToken.sol#L57-L1007)

contracts/src/LToken.sol#L553


 - [ ] ID-20
Redundant expression "[account](contracts/src/LToken.sol#L563)" in[LToken](contracts/src/LToken.sol#L57-L1007)

contracts/src/LToken.sol#L563


 - [ ] ID-21
Redundant expression "[account](contracts/src/LToken.sol#L552)" in[LToken](contracts/src/LToken.sol#L57-L1007)

contracts/src/LToken.sol#L552


 - [ ] ID-22
Redundant expression "[amount](contracts/src/LToken.sol#L564)" in[LToken](contracts/src/LToken.sol#L57-L1007)

contracts/src/LToken.sol#L564


