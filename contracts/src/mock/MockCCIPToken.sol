// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

// Contracts
import { CCIPToken } from "../misc/CCIPToken.sol";
import { GlobalOwnableUpgradeable } from "../abstracts/GlobalOwnableUpgradeable.sol";
import { GlobalPausableUpgradeable } from "../abstracts/GlobalPausableUpgradeable.sol";
import { GlobalRestrictableUpgradeable } from "../abstracts/GlobalRestrictableUpgradeable.sol";
import { RecoverableUpgradeable } from "../abstracts/RecoverableUpgradeable.sol";
//
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

/**
 * @title MockCCIPToken
 * @notice A mock implementation of WrappedLToken for testing purposes
 */
contract MockCCIPToken is
  ERC20Upgradeable,
  GlobalOwnableUpgradeable,
  GlobalPausableUpgradeable,
  GlobalRestrictableUpgradeable,
  RecoverableUpgradeable,
  CCIPToken
{
  // ======== CONSTRUCTOR ======== //

  /**
   * @notice Initializes the WrappedLToken contract
   */
  constructor() {
    initialize(
      address(0),
      address(0),
      address(0),
      "Mock CCIP",
      "MCCIP"
    );

    grantMintAndBurnRoles(msg.sender);
    _mint(msg.sender, 1_000_000 ether);
  }

  /**
   * @notice Initializes the WrappedLToken contract
   * @param globalOwner_ The address of the global owner
   * @param globalPause_ The address of the global pause controller
   * @param globalBlacklist_ The address of the global blacklist controller
   * @param name_ Name for the wrapped token
   * @param symbol_ Symbol for the wrapped token
   */
  function initialize(
    address globalOwner_,
    address globalPause_,
    address globalBlacklist_,
    string memory name_,
    string memory symbol_
  ) public initializer {
    __ERC20_init(name_, symbol_);
    __CCIPCompatible_init(msg.sender);
    __GlobalOwnable_init(globalOwner_);
    __GlobalPausable_init(globalPause_);
    __GlobalRestrictable_init(globalBlacklist_);
    __Recoverable_init(address(this));
  }
}
