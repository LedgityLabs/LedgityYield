// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { GlobalBlacklist } from "../GlobalBlacklist.sol";

/**
 * @title GlobalRestrictableUpgradeable
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Derived contracts will inherit a blacklist state from the specified
 * GlobalBlacklist contract (see GlobalBlacklist.sol). This design facilitates
 * centralized management of a blacklist for all the Ledgity Yield contracts.
 *
 * @dev Security measure:
 * The _globalBlacklist state must be set at initialization time and, for evident
 * security reasons, cannot be changed afterward.
 *
 * @dev For further details, see "GlobalRestrictableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract GlobalRestrictableUpgradeable is Initializable {
  /**
   * @notice The GlobalBlacklist contract the blacklist state will be inherited from.
   * @dev This state is private so derived contracts cannot change its value.
   */
  GlobalBlacklist private _globalBlacklist;

  /**
   * @notice Initializer functions of the contract. They replace the constructor()
   * function in the context of upgradeable contracts.
   * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
   * @param globalBlacklist_ The address of the GlobalBlacklist contract.
   */
  function __GlobalRestrictable_init(
    address globalBlacklist_
  ) internal onlyInitializing {
    __GlobalRestrictable_init_unchained(globalBlacklist_);
  }

  function __GlobalRestrictable_init_unchained(
    address globalBlacklist_
  ) internal onlyInitializing {
    _globalBlacklist = GlobalBlacklist(globalBlacklist_);
  }

  /**
   * @notice Retrieves the address of GlobalBlacklist contract.
   * @return The address of the GlobalBlacklist contract.
   */
  function globalBlacklist() public view returns (address) {
    return address(_globalBlacklist);
  }

  /**
   * @notice Reverts if the given account is blacklisted by the GlobalBlacklist contract.
   * @param account Address to verify.
   */
  modifier notBlacklisted(address account) {
    require(isBlacklisted(account) == false, "L9");
    _;
  }

  /**
   * @notice Checks if the given account is blacklisted by the GlobalBlacklist contract.
   * @param account Address to verify.
   * @return Whether the account is blacklisted.
   */
  function isBlacklisted(
    address account
  ) internal view returns (bool) {
    return _globalBlacklist.isBlacklisted(account);
  }

  /**
   * @dev This empty reserved space is put in place to allow future versions to add
   * new variables without shifting down storage in the inheritance chain.
   * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
   */
  uint256[50] private __gap;
}
