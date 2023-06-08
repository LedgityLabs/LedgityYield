// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title RestrictedUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice Children contracts must implement the _setBlacklistContract() function.
 */

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "../Blacklist.sol";

abstract contract RestrictedUpgradeable is ContextUpgradeable {
    Blacklist private _list;

    /**
     * @dev Throws if called by an account blacklisted by the Blacklist contract.
     */
    modifier notBlacklisted() {
        require(_list.isBlacklisted(_msgSender()) == false, "Account blacklisted");
        _;
    }

    /**
     * @dev Set the blacklist contract address
     * @param contractAddress The address of the blacklist contract
     */
    function _setBlacklistContract(address contractAddress) internal {
        _list = Blacklist(contractAddress);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
