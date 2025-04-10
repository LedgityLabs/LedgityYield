// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

// Contracts
import { ERC20Upgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

// Interfaces
import { IGetCCIPAdmin } from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IGetCCIPAdmin.sol";
import { IERC677Receiver } from "@chainlink/contracts-ccip/src/v0.8/shared/interfaces/IERC677Receiver.sol";
import { IERC677 } from "@chainlink/contracts-ccip/src/v0.8/shared/token/ERC677/IERC677.sol";
import { IBurnMintERC20 } from "@chainlink/contracts-ccip/src/v0.8/shared/token/ERC20/IBurnMintERC20.sol";

/**
 * @title CCIPToken
 * @notice A module that adds CCIP compatibility features to ERC20 tokens
 * @dev This contract is designed to be imported and used to extend your existing token
 */
contract CCIPToken is IERC677, ERC20Upgradeable {
  // Role management state
  mapping(address => bool) private _minters;
  mapping(address => bool) private _burners;

  // CCIP admin (optional, can be different from the contract owner)
  address private _ccipAdmin;

  // Events for role management
  event MintAccessGranted(address indexed minter);
  event BurnAccessGranted(address indexed burner);
  event MintAccessRevoked(address indexed minter);
  event BurnAccessRevoked(address indexed burner);
  event CCIPAdminChanged(
    address indexed previousAdmin,
    address indexed newAdmin
  );

  // Errors
  error SenderNotMinter(address sender);
  error SenderNotBurner(address sender);
  error SenderNotOwnerOrCCIPAdmin(address sender);

  /**
   * @notice Initializes the CCIP token
   * @param initialCCIPAdmin The initial CCIP admin address
   */
  function __CCIPCompatible_init(address initialCCIPAdmin) internal {
    _ccipAdmin = initialCCIPAdmin;
  }

  /**
   * @notice Checks if the sender is authorized as a minter
   */
  modifier onlyMinter() {
    if (!isMinter(msg.sender)) revert SenderNotMinter(msg.sender);
    _;
  }

  /**
   * @notice Checks if the sender is authorized as a burner
   */
  modifier onlyBurner() {
    if (!isBurner(msg.sender)) revert SenderNotBurner(msg.sender);
    _;
  }

  /**
   * @notice Checks if the sender is the owner or CCIP admin
   * @dev The implementing contract should define isOwner()
   */
  modifier onlyOwnerOrCCIPAdmin() {
    if (!isOwner() && msg.sender != _ccipAdmin)
      revert SenderNotOwnerOrCCIPAdmin(msg.sender);
    _;
  }

  /**
   * @notice Function to determine if caller is owner - must be implemented by the inheriting contract
   */
  function isOwner() internal view virtual returns (bool) {}

  /**
   * @notice Implementation of ERC677 transferAndCall
   * @param to Recipient address
   * @param amount Amount to transfer
   * @param data Additional data to pass to the receiver
   * @return success Boolean indicating whether the operation succeeded
   */
  function transferAndCall(
    address to,
    uint256 amount,
    bytes memory data
  ) public returns (bool success) {
    _transfer(msg.sender, to, amount);
    emit Transfer(msg.sender, to, amount, data);
    if (to.code.length > 0) {
      IERC677Receiver(to).onTokenTransfer(msg.sender, amount, data);
    }
    return true;
  }

  /**
   * @notice Implementation of burns tokens from caller's account
   * @param amount Amount to burn
   */
  function burn(uint256 amount) public virtual onlyBurner {
    _burn(msg.sender, amount);
  }

  /**
   * @notice Implementation of burns tokens from a specified account
   * @param account Account to burn from
   * @param amount Amount to burn
   */
  function burn(
    address account,
    uint256 amount
  ) public virtual onlyBurner {
    _burn(account, amount);
  }

  /**
   * @notice Burns tokens from an account using an allowance
   * @param account Account to burn from
   * @param amount Amount to burn
   */
  function burnFrom(
    address account,
    uint256 amount
  ) public virtual onlyBurner {
    uint256 currentAllowance = allowance(account, msg.sender);
    require(
      currentAllowance >= amount,
      "ERC20: burn amount exceeds allowance"
    );

    // Reduce allowance before burning
    _approve(account, msg.sender, currentAllowance - amount);
    _burn(account, amount);
  }

  /**
   * @notice Implementation of mints tokens to a specified account
   * @param account Account to mint to
   * @param amount Amount to mint
   */
  function mint(
    address account,
    uint256 amount
  ) external virtual onlyMinter {
    _mint(account, amount);
  }

  // Role management functions

  /**
   * @notice Grants minter role to an account
   * @param minter The account to grant the role to
   */
  function grantMintRole(
    address minter
  ) external virtual onlyOwnerOrCCIPAdmin {
    if (!_minters[minter]) {
      _minters[minter] = true;
      emit MintAccessGranted(minter);
    }
  }

  /**
   * @notice Revokes minter role from an account
   * @param minter The account to revoke the role from
   */
  function revokeMintRole(
    address minter
  ) external virtual onlyOwnerOrCCIPAdmin {
    if (_minters[minter]) {
      _minters[minter] = false;
      emit MintAccessRevoked(minter);
    }
  }

  /**
   * @notice Grants burner role to an account
   * @param burner The account to grant the role to
   */
  function grantBurnRole(
    address burner
  ) external virtual onlyOwnerOrCCIPAdmin {
    if (!_burners[burner]) {
      _burners[burner] = true;
      emit BurnAccessGranted(burner);
    }
  }

  /**
   * @notice Revokes burner role from an account
   * @param burner The account to revoke the role from
   */
  function revokeBurnRole(
    address burner
  ) external virtual onlyOwnerOrCCIPAdmin {
    if (_burners[burner]) {
      _burners[burner] = false;
      emit BurnAccessRevoked(burner);
    }
  }

  /**
   * @notice Grants both mint and burn roles to an account
   * @param account The account to grant both roles to
   */
  function grantMintAndBurnRoles(
    address account
  ) external virtual onlyOwnerOrCCIPAdmin {
    if (!_minters[account]) {
      _minters[account] = true;
      emit MintAccessGranted(account);
    }

    if (!_burners[account]) {
      _burners[account] = true;
      emit BurnAccessGranted(account);
    }
  }

  /**
   * @notice Sets the CCIP admin address
   * @param newAdmin The new CCIP admin address
   */
  function setCCIPAdmin(
    address newAdmin
  ) external virtual onlyOwnerOrCCIPAdmin {
    address oldAdmin = _ccipAdmin;
    _ccipAdmin = newAdmin;
    emit CCIPAdminChanged(oldAdmin, newAdmin);
  }

  /**
   * @notice Gets the CCIP admin address
   * @return The CCIP admin address
   */
  function getCCIPAdmin() external view virtual returns (address) {
    return _ccipAdmin;
  }

  /**
   * @notice Checks if an account has the minter role
   * @param account The account to check
   * @return True if the account has the role
   */
  function isMinter(
    address account
  ) public view virtual returns (bool) {
    return _minters[account];
  }

  /**
   * @notice Checks if an account has the burner role
   * @param account The account to check
   * @return True if the account has the role
   */
  function isBurner(
    address account
  ) public view virtual returns (bool) {
    return _burners[account];
  }

  /**
   * @dev This empty reserved space is put in place to allow future versions to add new
   * variables without shifting down storage in the inheritance chain.
   */
  uint256[49] private __gap;
}
