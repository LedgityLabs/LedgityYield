//SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "../../src/EthVault.sol";

/**
 * @title FailedTransfer
 * @notice This contract is used to test failed transfers the Vault contract.
 */
contract FailedTransfer {
    event Received(address sender, uint256 amount);
    event Fallback(address sender, uint256 amount, bytes data);

    EthVault public vault = EthVault(0x2e234DAe75C793f67A35089C9d99245E1C58470b);

    receive() external payable {
        emit Received(msg.sender, msg.value);
        revert();
    }

    function enter() public payable {
        vault.enter{value: msg.value}();
    }

    function exit(uint256 _amount) public {
        vault.exit(_amount);
    }

    function claimRewards() public {
        vault.claimRewards();
    }
}
