// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

library HederaResponseCodes {
    int32 internal constant SUCCESS = 22; // The transaction succeeded
    int32 internal constant TOKEN_HAS_NO_SUPPLY_KEY = 180;
}
