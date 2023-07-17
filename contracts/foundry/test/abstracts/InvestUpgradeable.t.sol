// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../../lib/forge-std/src/Test.sol";
import {ModifiersExpectations} from "../_helpers/ModifiersExpectations.sol";

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {InvestUpgradeable} from "../../../src/abstracts/InvestUpgradeable.sol";
import {GlobalOwner} from "../../../src/GlobalOwner.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import {GenericERC20} from "../../../src/GenericERC20.sol";

import {UDS3} from "../../../src/libs/UDS3.sol";
import {APRCheckpoints as APRC} from "../../../src/libs/APRCheckpoints.sol";

contract TestedContract is Initializable, UUPSUpgradeable, InvestUpgradeable {
    mapping(address => uint256) public stakeOf;

    constructor() {
        _disableInitializers();
    }

    function initialize(address globalOwner_, address invested_) public initializer {
        __UUPSUpgradeable_init();
        __Invest_init(globalOwner_, invested_);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev Create simple stake and unstake functions to simulate investment.
     * Note that those functions doesn't even transfer invested token as
     * not necessary for the tests as no InvestUpgradeable function rely
     * on invested().balanceOf()
     */
    function stake(uint256 amount) public {
        _resetInvestmentPeriodOf(msg.sender, false);
        stakeOf[msg.sender] += amount;
    }

    function unstake(uint256 amount) public {
        _resetInvestmentPeriodOf(msg.sender, false);
        stakeOf[msg.sender] -= amount;
    }

    function _investmentOf(address account) internal view override returns (uint256) {
        return stakeOf[account];
    }

    /**
     * @dev Implementation of _claimRewardsOf() function that can be controlled by boolean
     * variables to simulate different scenarios.
     */
    uint256 public _claimRewardsOf_CallsCount;
    bool _claimRewardsOf_Implemented;
    bool _claimRewardsOf_ResetInvestmentPeriod;
    bool _claimRewardsOf_Autocompound;

    function set_claimRewardsOf_Implemented(bool value) public {
        _claimRewardsOf_Implemented = value;
    }

    function set_claimRewardsOf_ResetInvestmentPeriod(bool value) public {
        _claimRewardsOf_ResetInvestmentPeriod = value;
    }

    function set_claimRewardsOf_Autocompound(bool value) public {
        _claimRewardsOf_Autocompound = value;
    }

    function _claimRewardsOf(address account, uint256 amount) internal override returns (bool) {
        // Return false when not implemented
        if (!_claimRewardsOf_Implemented) return false;

        // Keep track of implemented calls count
        _claimRewardsOf_CallsCount++;

        // Reset investment period if requested
        if (_claimRewardsOf_ResetInvestmentPeriod) {
            _resetInvestmentPeriodOf(account, _claimRewardsOf_Autocompound);
        }

        // In this implementation claiming == re-investing / compounding
        stakeOf[account] += amount;

        // Return true to simulate success
        return true;
    }

    function public_claimRewardsOf(address account, uint256 amount) public returns (bool) {
        return _claimRewardsOf(account, amount);
    }

    function public_toDecimals(uint256 n) public view returns (uint256) {
        return _toDecimals(n);
    }

    function public_fromDecimals(uint256 n) public view returns (uint256) {
        return _fromDecimals(n);
    }

    function public_toUDS3(uint256 n) public view returns (uint256) {
        return _toUDS3(n);
    }

    function public_fromUDS3(uint256 n) public view returns (uint256) {
        return _fromUDS3(n);
    }

    function public_calculatePeriodRewards(
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public view returns (uint256 rewards) {
        return _calculatePeriodRewards(beginTimestamp, endTimestamp, aprUD3, investedAmount);
    }

    function public_rewardsOf(address account, bool autocompound) public view returns (uint256 rewards) {
        return _rewardsOf(account, autocompound);
    }

    function public_resetInvestmentPeriodOf(address account, bool autocompound) public {
        _resetInvestmentPeriodOf(account, autocompound);
    }

    function public_accountsInfos(address account) public view returns (AccountInfos memory) {
        return accountsInfos[account];
    }

    function public_getStartCheckpointReferenceOf(
        address account
    ) public view returns (APRC.Reference memory) {
        return ___getStartCheckpointReferenceOf(account);
    }
}

contract Tests is Test, ModifiersExpectations {
    TestedContract tested;
    GlobalOwner globalOwner;
    GenericERC20 investedToken;

    function setUp() public {
        // Deploy GlobalOwner
        GlobalOwner impl = new GlobalOwner();
        ERC1967Proxy proxy = new ERC1967Proxy(address(impl), "");
        globalOwner = GlobalOwner(address(proxy));
        globalOwner.initialize();
        vm.label(address(globalOwner), "GlobalOwner");

        // Deploy GenericERC20
        investedToken = new GenericERC20("Dummy Token", "DUMMY", 6);
        vm.label(address(investedToken), "Invested token");

        // Deploy tested contract
        TestedContract impl2 = new TestedContract();
        ERC1967Proxy proxy2 = new ERC1967Proxy(address(impl2), "");
        tested = TestedContract(address(proxy2));
        tested.initialize(address(globalOwner), address(investedToken));
        vm.label(address(tested), "TestedContract");
    }

    // =============================
    // === initialize() function ===
    function test_initialize_1() public {
        console.log("Should properly set global owner");
        assertEq(tested.globalOwner(), address(globalOwner));
    }

    // ==============================
    // === invested() function ===
    function test_invested_1() public {
        console.log("Should return address given during initialization");
        assertEq(address(tested.invested()), address(investedToken));
    }

    // =========================
    // === setAPR() function ===
    function testFuzz_setAPR_1(uint16 newAPRUD3) public {
        console.log("Should update the APR return by getAPR()");

        tested.setAPR(newAPRUD3);
        assertEq(tested.getAPR(), newAPRUD3);
    }

    // =========================
    // === getAPR() function ===
    function testFuzz_getAPR_1(uint16 newAPRUD3) public {
        console.log("Should return last set APR");

        // Ensure initial APR is 0
        assertEq(tested.getAPR(), 0);

        // Set a new latest APR and ensure getAPR() returns it
        vm.assume(newAPRUD3 > 0);
        tested.setAPR(newAPRUD3);
        assertEq(tested.getAPR(), newAPRUD3);
    }

    // ==================================
    // === _claimRewardsOf() function ===
    function testFuzz__claimRewardsOf_1(address account, uint256 amount) public {
        console.log("Should return false when not implemented");
        // Note: as we don't call set_claimRewardsOf_Implemented(true) the function
        // behave like it's not implemented
        assertFalse(tested.public_claimRewardsOf(account, amount));
    }

    // ==============================
    // === _toDecimals() function ===
    function testFuzz__toDecimals_1(uint8 decimals, uint256 n) public {
        console.log("Should return given number times 10^decimals when doesn't overflow");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Restrict n to non-overflowing values
        n = bound(n, 0, type(uint256).max / (10 ** decimals));

        assertEq(tested.public_toDecimals(n), n * 10 ** decimals);
    }

    function testFuzz__toDecimals_2(uint8 decimals, uint256 n) public {
        console.log("Should properly overflow on big numbers");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Restrict n to overflowing values
        n = bound(n, type(uint256).max / (10 ** decimals), type(uint256).max);
        vm.assume(n > type(uint256).max / (10 ** decimals));

        vm.expectRevert(stdError.arithmeticError);
        tested.public_toDecimals(n);
    }

    // ================================
    // === _fromDecimals() function ===
    function testFuzz__fromDecimals_1(uint8 decimals, uint256 n) public {
        console.log("Should return given number divided by 10^decimals and never revert");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        assertEq(tested.public_fromDecimals(n), n / 10 ** decimals);
    }

    // ==========================
    // === _toUDS3() function ===
    function testFuzz__toUDS3_1(uint8 decimals, uint256 n) public {
        console.log("Should return given number times 10^decimals+3 when doesn't overflow");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Restrict n to non-overflowing values
        n = bound(n, 0, type(uint256).max / 10 ** (decimals) / 10 ** 3);

        assertEq(tested.public_toUDS3(n), n * 10 ** (decimals + 3));
    }

    function testFuzz__toUDS3_2(uint8 decimals, uint256 n) public {
        console.log("Should properly overflow on big numbers");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Restrict n to overflowing values
        n = bound(n, type(uint256).max / 10 ** decimals / 10 ** 3, type(uint256).max);
        vm.assume(n > type(uint256).max / 10 ** decimals / 10 ** 3);

        vm.expectRevert(stdError.arithmeticError);
        tested.public_toUDS3(n);
    }

    // ============================
    // === _fromUDS3() function ===
    function testFuzz__fromUDS3_1(uint8 decimals, uint256 n) public {
        console.log("Should return given number divided by 10^decimals and never revert");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        assertEq(tested.public_fromUDS3(n), n / 10 ** decimals / 10 ** 3);
    }

    // ================================
    // === _calculatePeriodRewards() function ===
    function testFuzz__calculatePeriodRewards_1(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log(
            "Shouldn't overflow/underflow before 100T of invested amount and up to 18 decimals."
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Calculate rewards (shouldn't revert)
        tested.public_calculatePeriodRewards(beginTimestamp, endTimestamp, aprUD3, investedAmount);
    }

    function testFuzz__calculatePeriodRewards_2(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log("Should properly apply given APR");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );
        if (rewards == 0) return;

        // Compute applied APR from rewards, elapsed time and invested amount
        uint256 growthUDS3 = (UDS3.scaleUp(rewards) * tested.public_toUDS3(1)) /
            UDS3.scaleUp(investedAmount);

        uint256 elaspedTimeUDS3 = tested.public_toUDS3(endTimestamp - beginTimestamp);
        uint256 elapsedYearsUDS3 = (elaspedTimeUDS3 * tested.public_toUDS3(1)) /
            tested.public_toUDS3(365 days);

        uint256 appliedAPRUDS3 = (growthUDS3 * tested.public_toUDS3(1)) / elapsedYearsUDS3;
        uint256 appliedAPRUD3 = tested.public_fromDecimals(appliedAPRUDS3);

        // Ensure applied APR is equal to given APR
        if (UDS3.scaleDown(appliedAPRUD3) != 0) assertEq(appliedAPRUD3, aprUD3);
    }

    function testFuzz__calculatePeriodRewards_3(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log("Should properly apply given period");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );
        if (rewards == 0) return;

        // Compute applied elapsed time from rewards, APR and invested amount
        uint256 growthUDS3 = (UDS3.scaleUp(rewards) * tested.public_toUDS3(1)) /
            UDS3.scaleUp(investedAmount);

        uint256 aprUDS3 = tested.public_toUDS3(aprUD3);

        uint256 appliedElapsedTimeUDS3 = (growthUDS3 * tested.public_toUDS3(1)) / aprUDS3;
        uint256 appliedElapsedTime = tested.public_fromUDS3(appliedElapsedTimeUDS3);

        // Ensure applied elapsed time is equal to given elapsed time
        if (appliedElapsedTime != 0) assertEq(appliedElapsedTime, endTimestamp - beginTimestamp);
    }

    /// forge-config: default.fuzz.runs = 1000
    function testFuzz__calculatePeriodRewards_4(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log("Should properly apply given invested amount (when >5% APR and >365 days period)");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure period is >365days and APR >5% to prevent failure because of precision loss
        aprUD3 = uint16(bound(aprUD3, UDS3.scaleUp(5), type(uint16).max));
        beginTimestamp = uint40(bound(beginTimestamp, 0, type(uint40).max - 365 days));
        endTimestamp = uint40(bound(endTimestamp, beginTimestamp + 365 days, type(uint40).max));

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );
        if (rewards == 0) return;

        // Compute applied invested amount from rewards, APR and elapsed time
        uint256 elaspedTimeUDS3 = tested.public_toUDS3(endTimestamp - beginTimestamp);
        uint256 elapsedYearsUDS3 = (elaspedTimeUDS3 * tested.public_toUDS3(1)) /
            tested.public_toUDS3(365 days);

        uint256 aprUDS3 = tested.public_toDecimals(aprUD3); // UD3 to UDS3
        uint256 growthUDS3 = (elapsedYearsUDS3 * aprUDS3) / tested.public_toUDS3(1);

        uint256 rewardsUDS3 = UDS3.scaleUp(rewards);
        uint256 appliedInvestedAmountUDS3 = (rewardsUDS3 * tested.public_toUDS3(100)) / growthUDS3;
        uint256 appliedInvestedAmount = UDS3.scaleDown(appliedInvestedAmountUDS3);

        // Ensure applied invested amount is near to invested amount
        if (appliedInvestedAmount != 0) {
            uint256 difference = appliedInvestedAmount > investedAmount
                ? appliedInvestedAmount - investedAmount
                : investedAmount - appliedInvestedAmount;
            assertTrue(difference <= tested.public_toDecimals(100));
        }
    }

    function testFuzz__calculatePeriodRewards_5(
        uint8 decimals,
        uint40 beginTimestamp,
        uint40 endTimestamp,
        uint16 aprUD3,
        uint256 investedAmount
    ) public {
        console.log("Should properly apply given invested amount (other cases)");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Ensure beginTimestamp is before endTimestamp
        vm.assume(beginTimestamp < endTimestamp);

        // Get rewards
        uint256 rewards = tested.public_calculatePeriodRewards(
            beginTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );
        if (rewards == 0) return;

        // Compute applied invested amount from rewards, APR and elapsed time
        uint256 elaspedTimeUDS3 = tested.public_toUDS3(endTimestamp - beginTimestamp);
        uint256 elapsedYearsUDS3 = (elaspedTimeUDS3 * tested.public_toUDS3(1)) /
            tested.public_toUDS3(365 days);

        uint256 aprUDS3 = tested.public_toDecimals(aprUD3); // UD3 to UDS3
        uint256 growthUDS3 = (elapsedYearsUDS3 * aprUDS3) / tested.public_toUDS3(1);

        uint256 rewardsUDS3 = UDS3.scaleUp(rewards);
        uint256 appliedInvestedAmountUDS3 = (rewardsUDS3 * tested.public_toUDS3(100)) / growthUDS3;
        uint256 appliedInvestedAmount = UDS3.scaleDown(appliedInvestedAmountUDS3);

        // Ensure applied invested amount is always smaller than real invested amount
        if (appliedInvestedAmount != 0) {
            assertTrue(appliedInvestedAmount <= investedAmount);
        }
    }

    // =============================
    // === _rewardsOf() function ===
    function testFuzz__rewardsOf_1(uint8 decimals, bool autocompound) public {
        console.log("Should return 0 when not APR checkpoints");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        assertEq(tested.public_rewardsOf(address(1234), autocompound), 0);
    }

    function testFuzz__rewardsOf_2(uint8 decimals, uint16 aprUD3, bool autocompound) public {
        console.log("Should return 0 when APR checkpoints but no investment");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap APR to half its max value
        aprUD3 = uint16(bound(aprUD3, 0, type(uint16).max / 2));

        // Set first random APR value and ensure rewards of returns 0
        tested.setAPR(aprUD3);
        assertEq(tested.public_rewardsOf(address(1234), autocompound), 0);

        // Set second random APR value and ensure rewards of returns 0
        tested.setAPR(aprUD3 * 2);
        assertEq(tested.public_rewardsOf(address(1234), autocompound), 0);
    }

    function testFuzz__rewardsOf_3(
        uint8 decimals,
        uint16 aprUD3,
        uint256 investedAmount,
        uint256 investmentDuration,
        bool autocompound
    ) public {
        console.log("Should properly calculate rewards when no new APR checkpoint after investment");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Set random APR
        tested.setAPR(aprUD3);

        // Invest random amount of tokens
        vm.prank(address(1234));
        tested.stake(investedAmount);

        // Simulate investment period
        uint40 startTimestamp = uint40(block.timestamp);
        investmentDuration = bound(investmentDuration, 0, type(uint40).max - startTimestamp); // prevent overflow
        skip(investmentDuration);
        uint40 endTimestamp = uint40(block.timestamp);

        // Calculate expected rewards
        uint256 expectedRewards = tested.public_calculatePeriodRewards(
            startTimestamp,
            endTimestamp,
            aprUD3,
            investedAmount
        );

        assertEq(tested.public_rewardsOf(address(1234), autocompound), expectedRewards);
    }

    function testFuzz__rewardsOf_4(
        uint8 decimals,
        uint16 aprUD3,
        uint256 investedAmount,
        uint256 numberOfCheckpoints,
        bool autocompound,
        uint40 investmentDuration
    ) public {
        console.log(
            "Should properly calculate rewards when one or many checkpoints have been added after investment"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 365 days
        investmentDuration = uint40(bound(investmentDuration, 0, 365 days));

        // Cap number of checkpoints to 200
        numberOfCheckpoints = bound(numberOfCheckpoints, 1, 200);

        // Create random number of checkpoints after investment
        uint256 expectedRewards = 0;
        uint40 latestCheckpointTimestamp = uint40(block.timestamp);
        uint16 latestCheckpointApr = aprUD3;

        // Create first APR
        tested.setAPR(latestCheckpointApr);

        // Invest random amount of tokens
        vm.prank(address(1234));
        tested.stake(investedAmount);

        // Create random number of checkpoints after investment
        for (uint256 i = 0; i < numberOfCheckpoints; i++) {
            uint40 newCheckpointTimestamp = uint40(block.timestamp);
            uint16 newCheckpointApr = aprUD3;
            tested.setAPR(newCheckpointApr);

            // Move forward a random amount of time
            skip(investmentDuration);

            // Calculate expected rewards for this past period
            expectedRewards += tested.public_calculatePeriodRewards(
                latestCheckpointTimestamp,
                newCheckpointTimestamp,
                latestCheckpointApr,
                investedAmount + (autocompound ? expectedRewards : 0)
            );

            latestCheckpointTimestamp = newCheckpointTimestamp;
            latestCheckpointApr = newCheckpointApr;
        }

        // Calculate rewards from last checkpoint to now
        expectedRewards += tested.public_calculatePeriodRewards(
            latestCheckpointTimestamp,
            uint40(block.timestamp),
            latestCheckpointApr,
            investedAmount + (autocompound ? expectedRewards : 0)
        );

        // Ensure calculated rewards are equal to expected rewards
        uint256 rewards = tested.public_rewardsOf(address(1234), autocompound);
        assertEq(rewards, expectedRewards);
    }

    // ===========================================
    // === _resetInvestmentPeriodOf() function ===
    function test__resetInvestmentPeriodOf_1(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD3,
        uint40 investmentDuration,
        bool autocompound
    ) public {
        console.log(
            "Should call claim rewards once / no infinite re-entrancy if _claimRewardsOf() itself indirectly or directly calls _resetInvestmentPeriodOf()"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Implements _claimRewardsOf() and make it call _resetInvestmentPeriodOf() again
        tested.set_claimRewardsOf_Implemented(true);
        tested.set_claimRewardsOf_ResetInvestmentPeriod(true);

        // Simulate investment period
        tested.setAPR(aprUD3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Call _resetInvestmentPeriodOf()
        tested.public_resetInvestmentPeriodOf(address(1234), autocompound);

        // Check that _claimRewardsOf() has been called once
        // Note that we use "lower than equal" as the _claimRewardsOf() function may not be
        // called at all if rewards are equal to 0
        assertLe(tested._claimRewardsOf_CallsCount(), 1);
    }

    function test__resetInvestmentPeriodOf_2(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD3,
        uint40 investmentDuration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log(
            "Should rely on _claimRewardsOf() to distribute rewards if implemented (= returns true) else on virtual balance"
        );

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Randomly implement _claimRewardsOf()
        tested.set_claimRewardsOf_Implemented(isImplemented);

        // Simulate investment period
        tested.setAPR(aprUD3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Store expected rewards and old staked and virtual balances
        uint256 expectedRewards = tested.public_rewardsOf(address(1234), autocompound);
        uint256 oldStakedBalance = tested.stakeOf(address(1234));
        uint256 oldVirtualBalance = tested.public_accountsInfos(address(1234)).virtualBalance;

        // Call _resetInvestmentPeriodOf()
        tested.public_resetInvestmentPeriodOf(address(1234), autocompound);

        // If _claimRewardsOf() is implemented
        if (isImplemented) {
            // Ensure that is has been called
            assertLe(tested._claimRewardsOf_CallsCount(), 1);

            // Ensure that it has properly minted rewards
            uint256 newStakedBalance = tested.stakeOf(address(1234));
            assertEq(newStakedBalance, oldStakedBalance + expectedRewards);

            // Ensure that the virtual balance ends on 0
            uint256 newVirtualBalance = tested.public_accountsInfos(address(1234)).virtualBalance;
            assertEq(newVirtualBalance, 0);
        }
        // If it isn't
        else {
            // Ensure that it hasn't been called
            assertEq(tested._claimRewardsOf_CallsCount(), 0);

            // Ensure that rewards have been properly accumulated in virtual balance
            uint256 newVirtualBalance = tested.public_accountsInfos(address(1234)).virtualBalance;
            assertEq(newVirtualBalance, oldVirtualBalance + expectedRewards);
        }
    }

    function test__resetInvestmentPeriodOf_3(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD3,
        uint40 investmentDuration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log("Should reset investment period timestamp to now");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Randomly implement _claimRewardsOf()
        tested.set_claimRewardsOf_Implemented(isImplemented);

        // Simulate investment period
        tested.setAPR(aprUD3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Call _resetInvestmentPeriodOf()
        tested.public_resetInvestmentPeriodOf(address(1234), autocompound);

        // Ensure that the investment period timestamp has been updated to now
        assertEq(tested.public_accountsInfos(address(1234)).period.timestamp, block.timestamp);
    }

    function test__resetInvestmentPeriodOf_4(
        uint8 decimals,
        uint256 investedAmount,
        uint16 aprUD3,
        uint40 investmentDuration,
        bool autocompound,
        bool isImplemented
    ) public {
        console.log("Should set investment period checkpoint reference to latest APR checkpoint");

        // Bound decimals to [0, 18] and set random invested token decimals
        decimals = uint8(bound(decimals, 0, 18));
        investedToken.setDecimals(decimals);

        // Cap invested amount to 100T
        investedAmount = bound(investedAmount, 0, tested.public_toDecimals(100_000_000_000_000));

        // Cap interval between checkpoints to 100 years
        investmentDuration = uint40(bound(investmentDuration, 0, 100 * 365 days));

        // Randomly implement _claimRewardsOf()
        tested.set_claimRewardsOf_Implemented(isImplemented);

        // Simulate investment period
        tested.setAPR(aprUD3);
        vm.prank(address(1234));
        tested.stake(investedAmount);
        skip(investmentDuration);

        // Call _resetInvestmentPeriodOf()
        tested.public_resetInvestmentPeriodOf(address(1234), autocompound);

        // Ensure that the checkpoint reference is the same as the latest APR checkpoint
        assertEq(
            tested.public_accountsInfos(address(1234)).period.ref.packIndex,
            tested.public_getStartCheckpointReferenceOf(address(1234)).packIndex
        );
        assertEq(
            tested.public_accountsInfos(address(1234)).period.ref.cursorIndex,
            tested.public_getStartCheckpointReferenceOf(address(1234)).cursorIndex
        );
    }
}
