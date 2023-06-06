// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title Blacklist
 * @author Lila Rest (lila@ledgity.com)
 * @notice Children contracts must implement the _setBlacklistContract() function.
 */

import "../Blacklist.sol";

abstract contract Blacklistable {
    Blacklist private blacklistContract;

    modifier notBlacklisted() {
        require(
            blacklistContract.isBlacklisted(msg.sender) == false,
            "Account blacklisted"
        );
        _;
    }

    function _setBlacklistContract(address _contract) internal {
        blacklistContract = Blacklist(_contract);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
