// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title LDYStaking
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract will replace the LDYStaking contract in L-Tokens contracts until
 * the $LDY token is available and the real LDYStaking contract is deployed so.
 * This contract only implements tierOf() function of LDYStaking as it is the only one
 * the LToken contract relies on.
 * @custom:security-contact security@ledgity.com
 */
contract LDYStaking {
    /**
     * @dev Dummy tierOf() function that always return that the given account is not
     * ellgible to any LDY staking tier.
     * @param account @
     */
    function tierOf(address account) public pure returns (uint256 tier) {
        account; // Silence unused variable compiler warning
        return 0;
    }
}
