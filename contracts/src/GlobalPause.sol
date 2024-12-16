// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { PausableUpgradeable } from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import { GlobalOwnableUpgradeable } from "./abstracts/GlobalOwnableUpgradeable.sol";

/**
 * @title GlobalPause
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Holds a global pause state shared by all contracts of the Ledgity Yield
 * codebase.
 *
 * @dev Specifically, some contracts within the codebase inherit from the
 * GlobalPausableUpgradeable abstract contract. This provides them with an overriden
 * paused() function that retrieves the pause state from this contract instead.
 *
 * @dev For further details, see "GlobalPause" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract GlobalPause is
  Initializable,
  UUPSUpgradeable,
  GlobalOwnableUpgradeable,
  PausableUpgradeable
{
  /**
   * @notice Prevents implementation contract from being initialized as recommended by
   * OpenZeppelin.
   * @dev See: https://docs.openzeppelin.com/contracts/4.x/api/proxy#Initializable-_disableInitializers--
   * @custom:oz-upgrades-unsafe-allow constructor
   */
  constructor() {
    _disableInitializers();
  }

  /**
   * @notice Initializer function of the contract. It replaces the constructor()
   * function in the context of upgradeable contracts.
   * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
   * @param globalOwner_ The address of the GlobalOwner contract.
   */
  function initialize(address globalOwner_) public initializer {
    __GlobalOwnable_init(globalOwner_);
    __Pausable_init();
    __UUPSUpgradeable_init();
  }

  /**
   * @notice Override of UUPSUpgradeable._authorizeUpgrade() function restricted to
   * global owner. It is called by the proxy contract during an upgrade.
   * @param newImplementation The address of the new implementation contract.
   */
  function _authorizeUpgrade(
    address newImplementation
  ) internal override onlyOwner {}

  /**
   * @dev Public implementation of PausableUpgradeable's pausing and unpausing functions
   * but restricted to contract's owner.
   */
  function pause() public onlyOwner {
    _pause();
  }

  function unpause() public onlyOwner {
    _unpause();
  }
}
