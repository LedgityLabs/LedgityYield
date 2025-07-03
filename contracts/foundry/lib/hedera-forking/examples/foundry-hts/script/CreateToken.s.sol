// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Script} from "forge-std/Script.sol";
import {HTS_ADDRESS} from "hedera-forking/HtsSystemContract.sol";
import {IHederaTokenService} from "hedera-forking/IHederaTokenService.sol";
import {Hsc} from "hedera-forking/Hsc.sol";

/**
 * Given how Foundry script works, the flag `--skip-simulation` is necessary.
 * For example
 *
 * forge script CreateTokenScript --rpc-url testnet --broadcast --skip-simulation
 */
contract CreateTokenScript is Script {
    function run() external returns (address signer, int64 responseCode, address tokenAddress) {
        Hsc.htsSetup();

        uint256 PRIVATE_KEY = vm.envUint("PRIVATE_KEY");
        signer = vm.addr(PRIVATE_KEY);

        IHederaTokenService.KeyValue memory keyValue;
        keyValue.inheritAccountKey = true;

        IHederaTokenService.HederaToken memory token;
        token.name = "HTS Token Example Created with Foundry";
        token.symbol = "FDRY";
        token.treasury = signer;
        token.memo = "This HTS Token was created using `forge script` together with HTS emulation";
        token.tokenKeys = new IHederaTokenService.TokenKey[](2);
        token.tokenKeys[0] = IHederaTokenService.TokenKey(0x1, keyValue); // Admin Key
        token.tokenKeys[1] = IHederaTokenService.TokenKey(0x10, keyValue); // Supply Key enables minting
        token.expiry = IHederaTokenService.Expiry(0, signer, 8000000);

        vm.startBroadcast(PRIVATE_KEY);
        (responseCode, tokenAddress) = IHederaTokenService(HTS_ADDRESS).createFungibleToken{value: 10 ether}(token, 10000, 4);
        vm.stopBroadcast();
    }
}
