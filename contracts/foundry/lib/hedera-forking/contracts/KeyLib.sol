// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {IHederaTokenService} from "./IHederaTokenService.sol";

library KeyLib {
    function keyExists(uint keyType, IHederaTokenService.TokenInfo memory tokenInfo) internal pure returns (bool) {
        for (uint256 i = 0; i < tokenInfo.token.tokenKeys.length; i++) {
            if (tokenInfo.token.tokenKeys[i].keyType == keyType) {
                IHederaTokenService.KeyValue memory key = tokenInfo.token.tokenKeys[i].key;
                return key.contractId != address(0) || (key.ECDSA_secp256k1.length + key.ed25519.length) > 0;
            }
        }
        return false;
    }
}
