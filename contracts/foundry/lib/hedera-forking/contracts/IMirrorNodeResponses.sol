// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

interface IMirrorNodeResponses {

    struct Key {
        string _type;
        string key;
    }

    struct FixedFee {
        bool all_collectors_are_exempt;
        int64 amount;
        string collector_account_id;
        string denominating_token_id;
    }

    struct FractionalAmount {
        int64 numerator;
        int64 denominator;
    }

    struct FractionalFee {
        bool all_collectors_are_exempt;
        FractionalAmount amount;
        string collector_account_id;
        string denominating_token_id;
        int64 maximum;
        int64 minimum;
        bool net_of_transfers;
    }

    struct RoyaltyFee {
        bool all_collectors_are_exempt;
        FractionalAmount amount;
        string collector_account_id;
        FallbackFee fallback_fee;
    }

    struct FallbackFee {
        int64 amount;
        string denominating_token_id;
    }

    struct TokenRelationship {
        bool automatic_association;
        uint256 balance;
        string created_timestamp;
        uint256 decimals;
        string token_id;
        string freeze_status;
        string kyc_status;
    }

    struct NonFungibleToken {
        string account_id;
        string created_timestamp;
        string delegating_spender;
        bool deleted;
        string metadata;
        string modified_timestamp;
        uint32 serial_number;
        string spender;
        string token_id;
    }
}
