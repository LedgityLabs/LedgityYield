// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./LToken.sol";

/**
 * @title WrappedLToken
 * @notice A non-rebasing wrapper for LToken that tracks growth through an exchange rate
 * @dev This contract wraps an LToken and provides a non-rebasing representation where
 *      the growth is tracked through an exchange rate rather than balance increases
 */
contract WrappedLToken is Initializable, ERC20Upgradeable, ReentrancyGuardUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using SafeERC20Upgradeable for LToken;

    // The underlying LToken being wrapped
    LToken public lToken;

    // Total amount of underlying LTokens held by this contract
    uint256 private _totalUnderlyingHeld;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    /**
     * @notice Initializes the WrappedLToken
     * @param _lToken Address of the LToken to wrap
     * @param _name Name for the wrapped token
     * @param _symbol Symbol for the wrapped token
     */
    function initialize(
        address _lToken,
        string memory _name,
        string memory _symbol
    ) external initializer {
        __ERC20_init(_name, _symbol);
        __ReentrancyGuard_init();
        lToken = LToken(_lToken);
    }

    /**
     * @notice Get the current exchange rate between wrapped tokens and LTokens
     * @return The exchange rate in ray (27 decimals)
     */
    function exchangeRate() public view returns (uint256) {
        if (_totalUnderlyingHeld == 0 || totalSupply() == 0) return 1e27; // 1.0 in ray
        
        // Calculate exchange rate using ray math (27 decimals) for better precision
        return ((_totalUnderlyingHeld * 1e27) / totalSupply());
    }

    /**
     * @notice Deposit LTokens and receive wrapped tokens
     * @param amount Amount of LTokens to deposit
     */
    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot deposit 0");
        
        // Transfer LTokens from user
        lToken.safeTransferFrom(msg.sender, address(this), amount);
        
        // Calculate amount of wrapped tokens to mint
        uint256 wrappedAmount = (amount * 1e27) / exchangeRate();
        
        // Update total underlying held
        _totalUnderlyingHeld += amount;
        
        // Mint wrapped tokens to user
        _mint(msg.sender, wrappedAmount);
    }

    /**
     * @notice Withdraw LTokens by burning wrapped tokens
     * @param wrappedAmount Amount of wrapped tokens to burn
     */
    function withdraw(uint256 wrappedAmount) external nonReentrant {
        require(wrappedAmount > 0, "Cannot withdraw 0");
        require(wrappedAmount <= balanceOf(msg.sender), "Insufficient balance");

        // Calculate amount of underlying tokens to return using current exchange rate
        uint256 underlyingAmount = (wrappedAmount * exchangeRate()) / 1e27;
        
        // Ensure we have enough underlying tokens
        require(underlyingAmount <= _totalUnderlyingHeld, "Insufficient underlying");
        
        // Burn wrapped tokens
        _burn(msg.sender, wrappedAmount);
        
        // Update total underlying held
        _totalUnderlyingHeld -= underlyingAmount;
        
        // Transfer underlying tokens to user
        lToken.safeTransfer(msg.sender, underlyingAmount);
    }

    /**
     * @notice Get the amount of underlying LTokens that would be received for a given amount of wrapped tokens
     * @param wrappedAmount Amount of wrapped tokens
     * @return Amount of underlying LTokens
     */
    function getUnderlyingAmount(uint256 wrappedAmount) external view returns (uint256) {
        return (wrappedAmount * exchangeRate()) / 1e27;
    }

    /**
     * @notice Get the amount of wrapped tokens that would be received for a given amount of underlying LTokens
     * @param underlyingAmount Amount of underlying LTokens
     * @return Amount of wrapped tokens
     */
    function getWrappedAmount(uint256 underlyingAmount) external view returns (uint256) {
        return (underlyingAmount * 1e27) / exchangeRate();
    }
}
