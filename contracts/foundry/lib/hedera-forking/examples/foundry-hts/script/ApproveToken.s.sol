// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Script, VmSafe} from "forge-std/Script.sol";
import {IERC20} from "hedera-forking/IERC20.sol";
import {IHRC719} from "hedera-forking/IHRC719.sol";
import {Hsc} from "hedera-forking/Hsc.sol";

contract Approver {
    function associate(address tokenAddress) external {
        IHRC719(tokenAddress).associate();
    }

    function approve(address tokenAddress, address account, uint256 amount) external {
        IERC20(tokenAddress).approve(account, amount);
    }
}

/**
 * Usage 
 * 
 * forge script ApproveTokenScript --sig "run(address)" $TOKEN_ADDR --rpc-url testnet --broadcast --skip-simulation --slow
 */
contract ApproveTokenScript is Script {
    function run(address tokenAddress) external returns (Approver approver, address payable account) {
        Hsc.htsSetup();

        uint256 PRIVATE_KEY = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(PRIVATE_KEY);
        approver = new Approver();
        vm.stopBroadcast();

        vm.startBroadcast(PRIVATE_KEY);
        Approver(approver).associate(tokenAddress);

        IERC20(tokenAddress).transfer(address(approver), 50000);

        VmSafe.Wallet memory wallet = vm.createWallet("wallet");
        account = payable(wallet.addr);
        account.transfer(1 ether); // 1 HBAR

        Approver(approver).approve(tokenAddress, account, 400_0000);

        vm.stopBroadcast();
    }
}
