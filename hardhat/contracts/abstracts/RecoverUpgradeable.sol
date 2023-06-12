// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

/**
 * @title RecoverUpgradeable
 * @author Lila Rest (lila@ledgity.com)
 * @notice This abstract contract provides helpers functions to recover assets accidentally
 * sent to the contract.
 * @dev For more details see "RecoverUpgradeable" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
abstract contract RecoverUpgradeable is ContextUpgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    /**
     * @dev Recover a given amount of tokens of the given contract address. Will fail
     * if not enough tokens are held by the contract
     * @param tokenAddress The address of the token to recover
     * @param amount The amount of token to recover
     */
    function recoverERC20(address tokenAddress, uint256 amount) public virtual {
        // Retrieve token contract
        IERC20Upgradeable tokenContract = IERC20Upgradeable(tokenAddress);

        // Ensure they is enough token to recover
        require(tokenContract.balanceOf(address(this)) >= amount, "Not enough tokens to recover.");

        // Transfer recovered ERC20 tokens to sender
        tokenContract.safeTransfer(_msgSender(), amount);
    }

    /**
     * @dev This empty reserved space is put in place to allow future versions to add
     * new variables without shifting down storage in the inheritance chain.
     * See https://docs.openzeppelin.com/contracts/4.x/upgradeable#storage_gaps
     */
    uint256[50] private __gap;
}
