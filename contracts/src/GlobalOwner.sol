// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { Ownable2StepUpgradeable } from "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";

/**
 * @title GlobalOwner
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Holds the address of a global owner account shared by all contracts of the
 * Ledgity Yield's codebase.
 *
 * @dev Specifically, some contracts within the codebase inherit from the
 * GlobalOwnableUpgradeable abstract contract. This provides them with an overriden
 * owner() function that retrieves the owner's address from this contract instead.
 *
 * @dev For further details, see "GlobalOwner" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract GlobalOwner is
  Initializable,
  UUPSUpgradeable,
  Ownable2StepUpgradeable
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
   */
  function initialize() public initializer {
    __Ownable2Step_init();
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
}
