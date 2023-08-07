// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {GlobalOwnableUpgradeable} from "./GlobalOwnableUpgradeable.sol";

import {SafeERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import {IERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

/**
 * @title RecoverableUpgradeable
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice Derived contracts are provided with helpers functions that allow recovering
 * assets accidentally sent to them.
 *
 * @dev Note: This abstract contract currently supports only ERC20 tokens. Derived
 * contracts currently do not implement necessary functions to receive Ether or
 * ERC721/ERC1155 tokens.
 *
 * @dev For further details, see "RecoverableUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract RecoverableUpgradeable is Initializable, GlobalOwnableUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * @notice Initializer functions of the contract. They replace the constructor()
     * function in the context of upgradeable contracts.
     * @dev See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract.
     */
    function __Recoverable_init(address globalOwner_) internal onlyInitializing {
        __GlobalOwnable_init(globalOwner_);
        __Recoverable_init_unchained();
    }

    function __Recoverable_init_unchained() internal onlyInitializing {}

    /**
     * @notice Recovers a specified amount of a given token address. Will fail if the
     * contract doesn't hold enough tokens.
     * @param tokenAddress The address of the token to recover.
     * @param amount The amount of token to recover.
     */
    function recoverERC20(address tokenAddress, uint256 amount) public virtual onlyOwner {
        // Ensure the specified amount is not zero
        require(amount > 0, "L10");

        // Create a reference to token's contract
        IERC20Upgradeable tokenContract = IERC20Upgradeable(tokenAddress);

        // Ensure there is enough token to recover
        require(tokenContract.balanceOf(address(this)) >= amount, "L11");

        // Transfer the recovered token amount to the sender
        tokenContract.safeTransfer(_msgSender(), amount);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
