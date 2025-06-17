// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {HTS_ADDRESS} from "hedera-forking/HtsSystemContract.sol";
import {IHederaTokenService} from "hedera-forking/IHederaTokenService.sol";
import {Hsc} from "hedera-forking/Hsc.sol";

/**
 * Replace the variables `$TOKEN_ADDR` and `$AMOUNT` with the desired values.
 *
 * forge script MintTokenScript --sig "run(address,uint)" $TOKEN_ADDR $AMOUNT --rpc-url testnet --broadcast --skip-simulation
 */
contract MintTokenScript is Script {
    function run(address tokenAddress, uint256 amount) external returns (int64 responseCode, int64 newTotalSupply) {
        Hsc.htsSetup();

        uint256 PRIVATE_KEY = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(PRIVATE_KEY);
        (responseCode, newTotalSupply,) = IHederaTokenService(HTS_ADDRESS).mintToken(tokenAddress, int64(int256(amount)), new bytes[](0));
        vm.stopBroadcast();
    }
}
