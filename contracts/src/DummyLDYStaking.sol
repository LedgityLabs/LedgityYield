// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Ownable2Step} from "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title LDYStaking
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice This contract acts as a placeholder for the real LDYStaking contract until
 * this one is deployed.
 *
 * @dev This contract only implements tierOf() function from LDYStaking as it's the only
 * one the LToken contract relies on.
 *
 * @custom:security-contact security@ledgity.com
 */
contract LDYStaking is Ownable2Step {
    /**
     * @notice Holds a mapping of addresses that default to the highest staking tier.
     * @dev This is notably used to allow PreMining contracts to benefit from 0%
     * withdrawal fees in L-Tokens contracts, when accounts unlock their funds.
     */
    mapping(address => bool) public highTierAccounts;

    /**
     * @notice Update high tier status of a given account.
     * @param account The account to update the high tier status of.
     */
    function setHighTierAccount(address account, bool status) public onlyOwner {
        highTierAccounts[account] = status;
    }

    /**
     * @dev Dummy tierOf() function that always return that the given account is not
     * elligible to any LDY staking tier, except if the account is in the
     * highTierAccounts mapping.
     * @param account The account to check the tier of.
     */
    function tierOf(address account) public view returns (uint256 tier) {
        if (highTierAccounts[account]) return 3;
        return 0;
    }
}
