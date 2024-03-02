**THIS CHECKLIST IS NOT COMPLETE**. Use `--show-ignored-findings` to show all the results.
Summary
 - [divide-before-multiply](#divide-before-multiply) (2 results) (Medium)
 - [incorrect-equality](#incorrect-equality) (1 results) (Medium)
 - [write-after-write](#write-after-write) (1 results) (Medium)
 - [events-access](#events-access) (2 results) (Low)
 - [events-maths](#events-maths) (2 results) (Low)
 - [calls-loop](#calls-loop) (3 results) (Low)
 - [reentrancy-events](#reentrancy-events) (1 results) (Low)
 - [timestamp](#timestamp) (1 results) (Low)
 - [boolean-equal](#boolean-equal) (1 results) (Informational)
 - [costly-loop](#costly-loop) (3 results) (Informational)
 - [dead-code](#dead-code) (2 results) (Informational)
 - [low-level-calls](#low-level-calls) (1 results) (Informational)
 - [redundant-statements](#redundant-statements) (7 results) (Informational)
## divide-before-multiply
Impact: Medium
Confidence: Medium
 - [ ] ID-0
[InvestUpgradeable._calculatePeriodRewards(uint40,uint40,uint16,uint256)](contracts/src/abstracts/InvestUpgradeable.sol#L258-L279) performs a multiplication on the result of a division:
	- [growthSUD = (elapsedYearsSUD * aprSUD) / SUD.fromInt(1,d)](contracts/src/abstracts/InvestUpgradeable.sol#L273)
	- [rewardsSUD = (investedAmountSUD * growthSUD) / SUD.fromInt(100,d)](contracts/src/abstracts/InvestUpgradeable.sol#L277)

contracts/src/abstracts/InvestUpgradeable.sol#L258-L279


 - [ ] ID-1
[InvestUpgradeable._calculatePeriodRewards(uint40,uint40,uint16,uint256)](contracts/src/abstracts/InvestUpgradeable.sol#L258-L279) performs a multiplication on the result of a division:
	- [elapsedYearsSUD = (elapsedTimeSUD * SUD.fromInt(1,d)) / SUD.fromInt(31536000,d)](contracts/src/abstracts/InvestUpgradeable.sol#L269)
	- [growthSUD = (elapsedYearsSUD * aprSUD) / SUD.fromInt(1,d)](contracts/src/abstracts/InvestUpgradeable.sol#L273)

contracts/src/abstracts/InvestUpgradeable.sol#L258-L279


## incorrect-equality
Impact: Medium
Confidence: High
 - [ ] ID-2
[InvestUpgradeable._beforeInvestmentChange(address,bool)](contracts/src/abstracts/InvestUpgradeable.sol#L409-L444) uses a dangerous strict equality:
	- [accountsDetails[account].period.timestamp == uint40(block.timestamp)](contracts/src/abstracts/InvestUpgradeable.sol#L417)

contracts/src/abstracts/InvestUpgradeable.sol#L409-L444


## write-after-write
Impact: Medium
Confidence: High
 - [ ] ID-3
[InvestUpgradeable._isClaiming](contracts/src/abstracts/InvestUpgradeable.sol#L88) is written in both
	[_isClaiming = true](contracts/src/abstracts/InvestUpgradeable.sol#L434)
	[_isClaiming = false](contracts/src/abstracts/InvestUpgradeable.sol#L436)

contracts/src/abstracts/InvestUpgradeable.sol#L88


## events-access
Impact: Low
Confidence: Medium
 - [ ] ID-4
[LToken.setWithdrawer(address)](contracts/src/LToken.sol#L296-L302) should emit an event for: 
	- [withdrawer = withdrawer_](contracts/src/LToken.sol#L301) 

contracts/src/LToken.sol#L296-L302


 - [ ] ID-5
[LToken.setFund(address)](contracts/src/LToken.sol#L308-L314) should emit an event for: 
	- [fund = fund_](contracts/src/LToken.sol#L313) 

contracts/src/LToken.sol#L308-L314


## events-maths
Impact: Low
Confidence: Medium
 - [ ] ID-6
[LToken.setRetentionRate(uint32)](contracts/src/LToken.sol#L279-L282) should emit an event for: 
	- [retentionRateUD7x3 = retentionRateUD7x3_](contracts/src/LToken.sol#L281) 

contracts/src/LToken.sol#L279-L282


 - [ ] ID-7
[LToken.setFeesRate(uint32)](contracts/src/LToken.sol#L269-L271) should emit an event for: 
	- [feesRateUD7x3 = feesRateUD7x3_](contracts/src/LToken.sol#L270) 

contracts/src/LToken.sol#L269-L271


## calls-loop
Impact: Low
Confidence: Medium
 - [ ] ID-8
[GlobalRestrictableUpgradeable.isBlacklisted(address)](contracts/src/abstracts/GlobalRestrictableUpgradeable.sol#L68-L70) has external calls inside a loop: [_globalBlacklist.isBlacklisted(account)](contracts/src/abstracts/GlobalRestrictableUpgradeable.sol#L69)

contracts/src/abstracts/GlobalRestrictableUpgradeable.sol#L68-L70


 - [ ] ID-9
[SUD.decimalsOf(address)](contracts/src/libs/SUD.sol#L82-L84) has external calls inside a loop: [IERC20MetadataUpgradeable(tokenAddress).decimals()](contracts/src/libs/SUD.sol#L83)

contracts/src/libs/SUD.sol#L82-L84


 - [ ] ID-10
[LToken.getWithdrawnAmountAndFees(address,uint256)](contracts/src/LToken.sol#L599-L617) has external calls inside a loop: [ldyStaking.tierOf(account) >= 2](contracts/src/LToken.sol#L604)

contracts/src/LToken.sol#L599-L617


## reentrancy-events
Impact: Low
Confidence: Medium
 - [ ] ID-11
Reentrancy in [LToken.processQueuedRequests()](contracts/src/LToken.sol#L736-L847):
	External calls:
	- [underlying().safeTransfer(request.account,withdrawnAmount)](contracts/src/LToken.sol#L825)
	Event emitted after the call(s):
	- [ActivityEvent(int256(nextRequestId),_msgSender(),Action.Withdraw,request.amount,request.amount,Status.Moved,int256(withdrawalQueue.length))](contracts/src/LToken.sol#L773-L781)
	- [ActivityEvent(int256(nextRequestId),request.account,Action.Withdraw,request.amount,withdrawnAmount,Status.Success,NO_ID)](contracts/src/LToken.sol#L806-L814)

contracts/src/LToken.sol#L736-L847


## timestamp
Impact: Low
Confidence: Medium
 - [ ] ID-12
[InvestUpgradeable._beforeInvestmentChange(address,bool)](contracts/src/abstracts/InvestUpgradeable.sol#L409-L444) uses timestamp for comparisons
	Dangerous comparisons:
	- [accountsDetails[account].period.timestamp == uint40(block.timestamp)](contracts/src/abstracts/InvestUpgradeable.sol#L417)

contracts/src/abstracts/InvestUpgradeable.sol#L409-L444


## boolean-equal
Impact: Informational
Confidence: High
 - [ ] ID-13
[GlobalRestrictableUpgradeable.notBlacklisted(address)](contracts/src/abstracts/GlobalRestrictableUpgradeable.sol#L58-L61) compares to a boolean constant:
	-[require(bool,string)(isBlacklisted(account) == false,L9)](contracts/src/abstracts/GlobalRestrictableUpgradeable.sol#L59)

contracts/src/abstracts/GlobalRestrictableUpgradeable.sol#L58-L61


## costly-loop
Impact: Informational
Confidence: Medium
 - [ ] ID-14
[LToken.processQueuedRequests()](contracts/src/LToken.sol#L736-L847) has costly operations inside a loop:
	- [delete withdrawalQueue[nextRequestId]](contracts/src/LToken.sol#L784)

contracts/src/LToken.sol#L736-L847


 - [ ] ID-15
[LToken.processQueuedRequests()](contracts/src/LToken.sol#L736-L847) has costly operations inside a loop:
	- [delete withdrawalQueue[nextRequestId]](contracts/src/LToken.sol#L763)

contracts/src/LToken.sol#L736-L847


 - [ ] ID-16
[LToken.processQueuedRequests()](contracts/src/LToken.sol#L736-L847) has costly operations inside a loop:
	- [delete withdrawalQueue[nextRequestId]](contracts/src/LToken.sol#L817)

contracts/src/LToken.sol#L736-L847


## dead-code
Impact: Informational
Confidence: Medium
 - [ ] ID-17
[SUD.toInt(uint256,uint256)](contracts/src/libs/SUD.sol#L162-L168) is never used and should be removed

contracts/src/libs/SUD.sol#L162-L168


 - [ ] ID-18
[InvestUpgradeable._distributeRewards(address,uint256)](contracts/src/abstracts/InvestUpgradeable.sol#L241-L245) is never used and should be removed

contracts/src/abstracts/InvestUpgradeable.sol#L241-L245


## low-level-calls
Impact: Informational
Confidence: High
 - [ ] ID-19
Low level call in [LToken.requestWithdrawal(uint256)](contracts/src/LToken.sol#L675-L729):
	- [(sent) = withdrawer.call{value: msg.value}()](contracts/src/LToken.sol#L727)

contracts/src/LToken.sol#L675-L729


## redundant-statements
Impact: Informational
Confidence: High
 - [ ] ID-20
Redundant expression "[account](contracts/src/abstracts/InvestUpgradeable.sol#L242)" in[InvestUpgradeable](contracts/src/abstracts/InvestUpgradeable.sol#L50-L452)

contracts/src/abstracts/InvestUpgradeable.sol#L242


 - [ ] ID-21
Redundant expression "[account](contracts/src/LToken.sol#L559)" in[LToken](contracts/src/LToken.sol#L57-L1003)

contracts/src/LToken.sol#L559


 - [ ] ID-22
Redundant expression "[amount](contracts/src/LToken.sol#L560)" in[LToken](contracts/src/LToken.sol#L57-L1003)

contracts/src/LToken.sol#L560


 - [ ] ID-23
Redundant expression "[amount](contracts/src/LToken.sol#L549)" in[LToken](contracts/src/LToken.sol#L57-L1003)

contracts/src/LToken.sol#L549


 - [ ] ID-24
Redundant expression "[account](contracts/src/LToken.sol#L548)" in[LToken](contracts/src/LToken.sol#L57-L1003)

contracts/src/LToken.sol#L548


 - [ ] ID-25
Redundant expression "[newOwner](contracts/src/abstracts/GlobalOwnableUpgradeable.sol#L70)" in[GlobalOwnableUpgradeable](contracts/src/abstracts/GlobalOwnableUpgradeable.sol#L24-L88)

contracts/src/abstracts/GlobalOwnableUpgradeable.sol#L70


 - [ ] ID-26
Redundant expression "[amount](contracts/src/abstracts/InvestUpgradeable.sol#L243)" in[InvestUpgradeable](contracts/src/abstracts/InvestUpgradeable.sol#L50-L452)

contracts/src/abstracts/InvestUpgradeable.sol#L243


