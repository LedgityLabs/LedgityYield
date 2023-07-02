// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {OwnableUpgradeable} from "../OwnableUpgradeable.sol";
import {PausableUpgradeable as _PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import {GlobalPauser} from "../../GlobalPauser.sol";

/**
 * @title PausableUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice
 * @dev For more details see "PausableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract PausableUpgradeable is OwnableUpgradeable, _PausableUpgradeable {
    /// @dev The Pause contract.
    GlobalPauser public globalPauser;

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Set the pause contract address
     * @param contractAddress The address of the blacklist contract
     */
    function setGlobalPauser(address contractAddress) public onlyOwner {
        globalPauser = GlobalPauser(contractAddress);
    }

    function paused() public view virtual override returns (bool) {
        return globalPauser.paused();
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
