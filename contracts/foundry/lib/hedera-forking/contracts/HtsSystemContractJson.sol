// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {Vm} from "forge-std/Vm.sol";
import {decode} from './Base64.sol';
import {IHederaTokenService} from "./IHederaTokenService.sol";
import {HtsSystemContract, HTS_ADDRESS} from "./HtsSystemContract.sol";
import {IERC20} from "./IERC20.sol";
import {MirrorNode} from "./MirrorNode.sol";
import {IMirrorNodeResponses} from "./IMirrorNodeResponses.sol";
import {Str} from "./Str.sol";
import {Store} from "./Store.sol";

contract HtsSystemContractJson is HtsSystemContract {
    Vm private constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    /**
     * This slot value indicates whether the token has been initialized.
     * In the token initialization, token data is fetched remotely if the token is not local.
     * This slot is accessed through the address of the token.
     */
    bytes32 private constant _initSlot = keccak256("HtsSystemContractJson::_initSlot");

    /**
     * This slot value indicates whether the token has been created in locally.
     * A token that has been created locally does not make any requests to fetch remote data.
     * This slot is accessed through the address of the token.
     */
    bytes32 private constant _isLocalTokenSlot = keccak256("HtsSystemContractJson::_isLocalTokenSlot");

    /**
     * The Proxy template bytecode as specified by HIP719.
     * It is treated as a template because the placeholder `fefefefefefefefefefefefefefefefefefefefe`
     * needs to be replace by the actual token address.
     * This bytecode is inlined here to avoid reading from file using `vm.readFile`,
     * which is disallowed unless `fs_permissions` is granted.
     * See https://book.getfoundry.sh/cheatcodes/fs#description for more details.
     */
    string private constant _HIP719TemplateBytecode = "0x6080604052348015600f57600080fd5b506000610167905077618dc65efefefefefefefefefefefefefefefefefefefefe600052366000602037600080366018016008845af43d806000803e8160008114605857816000f35b816000fdfea2646970667358221220d8378feed472ba49a0005514ef7087017f707b45fb9bf56bb81bb93ff19a238b64736f6c634300080b0033";

    /**
     * The state variable `_mirrorNode` is accessed through the `0x167` address.
     */
    MirrorNode private _mirrorNode;

    function setMirrorNodeProvider(MirrorNode mirrorNode_) htsCall external {
        _mirrorNode = mirrorNode_;
    }

    /**
     * @dev HTS can be used to propagate allow cheat codes flag onto the token Proxies Smart Contracts.
     * We can call `vm.allowCheatcodes` from within the HTS context.
     */
    function allowCheatcodes(address target) htsCall external {
        vm.allowCheatcodes(target);
    }

    /**
     * @dev For testing, we support accounts created with `makeAddr`.
     * These accounts will not exist on the mirror node,
     * so we calculate a deterministic (but unique) ID at runtime as a fallback.
     * The call to the Mirror Node verifies the existence of the account.
     */
    function _getAccountIdSlot(address account) internal view override returns (bytes32) {
        bytes32 slot = super._getAccountIdSlot(account);
        if (_shouldFetch(slot)) {
            uint32 accountId = uint32(bytes4(keccak256(abi.encodePacked(account))));
            bytes32 value = bytes32(uint256(accountId));

            // It uses low-level `statiscall`s to enable this function to be `view`.
            bool success;
            bytes memory json;
            (success, json) = address(mirrorNode()).staticcall(abi.encodeWithSignature("fetchAccount(string)", vm.toString(account)));
            if (success) {
                if (vm.keyExistsJson(abi.decode(json, (string)), ".evm_address")) {
                    value |= bytes32(uint256(1) << 248);
                }
            }

            (success, ) = address(vm).staticcall(abi.encodeWithSignature("store(address,bytes32,bytes32)", address(this), slot, value));
            require(success);
            (success, ) = address(vm).staticcall(abi.encodeWithSignature("store(address,bytes32,bytes32)", _scratchAddr(), slot, bytes32(uint(1))));
            require(success);
        }
        return slot;
    }

    function __redirectForToken() internal override returns (bytes memory) {
        HtsSystemContractJson(HTS_ADDRESS).allowCheatcodes(address(this));
        return super.__redirectForToken();
    }

    function mirrorNode() private view returns (MirrorNode) {
        bytes32 slot;
        assembly { slot := _mirrorNode.slot }
        return MirrorNode(address(uint160(uint256(vm.load(HTS_ADDRESS, slot)))));
    }

    function deployHIP719Proxy(address tokenAddress) override internal {
        string memory placeholder = "fefefefefefefefefefefefefefefefefefefefe";
        string memory addressString = vm.replace(vm.toString(tokenAddress), "0x", "");
        string memory proxyBytecode = vm.replace(_HIP719TemplateBytecode, placeholder, addressString);
        vm.etch(tokenAddress, vm.parseBytes(proxyBytecode));
    }

    function __setTokenInfo(string memory tokenType_, IHederaTokenService.TokenInfo memory tokenInfo, int32 decimals_) public override {
        // Marks the `_tokenInfo` as initialized.
        // This avoids fetching token data from the Mirror Node.
        // It is needed because the token only exists in the local EVM state,
        // not in the remote network.
        bytes32 initSlot = _initSlot;
        assembly { sstore(initSlot, 1) }
        bytes32 isLocalTokenSlot = _isLocalTokenSlot;
        assembly { sstore(isLocalTokenSlot , 1) }

        super.__setTokenInfo(tokenType_, tokenInfo, decimals_);
    }

    /**
     * @dev Fetches Smart Contract's token data from the MirrorNode and writes it into its storage.
     */
    function _initTokenData() internal override {
        if (vm.load(address(this), _initSlot) == bytes32(uint256(1))) {
            return;
        }

        bytes32 slot;
        string memory json = mirrorNode().fetchTokenData(address(this));
        if (vm.keyExistsJson(json, "._status")) {
            // Token not found
            assembly { slot := tokenType.slot }
            Store.storeString(address(this), uint256(slot), "NOT_FOUND");
            return;
        }

        assembly { slot := tokenType.slot }
        Store.storeString(address(this), uint256(slot), vm.parseJsonString(json, ".type"));

        assembly { slot := decimals.slot }
        Store.storeUint(address(this), uint256(slot), vm.parseJsonUint(json, ".decimals"));

        Store.storeBool(address(this), uint256(_initSlot), true);

        _initTokenInfo(json);
    }

    function _initTokenInfo(string memory json) internal {
        TokenInfo memory tokenInfo = _getTokenInfo(json);

        bytes32 slotBytes;
        assembly { slotBytes := _tokenInfo.slot }

        uint256 slot = uint256(slotBytes);

        // Name
        Store.storeString(address(this), slot++, tokenInfo.token.name);

        // Symbol
        Store.storeString(address(this), slot++, tokenInfo.token.symbol);

        // Treasury
        Store.storeAddress(address(this), slot++, tokenInfo.token.treasury);

        // Memo
        Store.storeString(address(this), slot++, tokenInfo.token.memo);

        Store.storeBool(address(this), slot, 0, tokenInfo.token.tokenSupplyType);
        Store.storeInt64(address(this), slot, 1, tokenInfo.token.maxSupply);
        Store.storeBool(address(this), slot++, 9, tokenInfo.token.freezeDefault);

        // Token keys
        // https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html
        Store.storeUint(address(this), slot, tokenInfo.token.tokenKeys.length);
        uint256 itemSlot = uint256(keccak256(abi.encodePacked(slot)));
        for (uint256 i = 0; i < tokenInfo.token.tokenKeys.length; i++) {
            // Key type
            Store.storeUint(address(this), itemSlot++, tokenInfo.token.tokenKeys[i].keyType);
            // Key value

            Store.storeBool(address(this), itemSlot, 0, tokenInfo.token.tokenKeys[i].key.inheritAccountKey);
            Store.storeAddress(address(this), itemSlot++, 1, tokenInfo.token.tokenKeys[i].key.contractId);

            Store.storeBytes(address(this), itemSlot++, tokenInfo.token.tokenKeys[i].key.ed25519);
            Store.storeBytes(address(this), itemSlot++, tokenInfo.token.tokenKeys[i].key.ECDSA_secp256k1);
            Store.storeAddress(address(this), itemSlot++, tokenInfo.token.tokenKeys[i].key.delegatableContractId);
        }
        slot += 1;

        // Expiry
        Store.storeInt64(address(this), slot, 0, tokenInfo.token.expiry.second);
        Store.storeAddress(address(this), slot++, 8, tokenInfo.token.expiry.autoRenewAccount);
        Store.storeInt64(address(this), slot++, tokenInfo.token.expiry.autoRenewPeriod);

        Store.storeInt64(address(this), slot, 0, tokenInfo.totalSupply);
        Store.storeBool(address(this), slot, 8, tokenInfo.deleted);
        Store.storeBool(address(this), slot, 9, tokenInfo.defaultKycStatus);
        Store.storeBool(address(this), slot++, 10, tokenInfo.pauseStatus);

        // Fixed fees
        // https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html
        itemSlot = uint256(keccak256(abi.encodePacked(slot)));
        Store.storeUint(address(this), slot, tokenInfo.fixedFees.length);
        for (uint256 i = 0; i < tokenInfo.fixedFees.length; i++) {
            Store.storeInt64(address(this), itemSlot, 0, tokenInfo.fixedFees[i].amount);
            Store.storeAddress(address(this), itemSlot, 8, tokenInfo.fixedFees[i].tokenId);
            Store.storeBool(address(this), itemSlot, 28, tokenInfo.fixedFees[i].useHbarsForPayment);
            Store.storeBool(address(this), itemSlot++, 29, tokenInfo.fixedFees[i].useCurrentTokenForPayment);
            Store.storeAddress(address(this), itemSlot++, tokenInfo.fixedFees[i].feeCollector);
        }
        slot += 1;

        // Fractional fees
        // https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html
        itemSlot = uint256(keccak256(abi.encodePacked(slot)));
        Store.storeUint(address(this), slot, tokenInfo.fractionalFees.length);
        for (uint256 i = 0; i < tokenInfo.fractionalFees.length; i++) {
            Store.storeInt64(address(this), itemSlot, 0, tokenInfo.fractionalFees[i].numerator);
            Store.storeInt64(address(this), itemSlot, 8, tokenInfo.fractionalFees[i].denominator);
            Store.storeInt64(address(this), itemSlot, 16, tokenInfo.fractionalFees[i].minimumAmount);
            Store.storeInt64(address(this), itemSlot++, 24, tokenInfo.fractionalFees[i].maximumAmount);
            Store.storeBool(address(this), itemSlot, 0, tokenInfo.fractionalFees[i].netOfTransfers);
            Store.storeAddress(address(this), itemSlot++, 1, tokenInfo.fractionalFees[i].feeCollector);
        }
        slot += 1;

        // Royalty fees
        // https://docs.soliditylang.org/en/latest/internals/layout_in_storage.html
        itemSlot = uint256(keccak256(abi.encodePacked(slot)));
        Store.storeUint(address(this), slot, tokenInfo.royaltyFees.length);
        for (uint256 i = 0; i < tokenInfo.royaltyFees.length; i++) {
            Store.storeInt64(address(this), itemSlot, 0, tokenInfo.royaltyFees[i].numerator);
            Store.storeInt64(address(this), itemSlot, 8, tokenInfo.royaltyFees[i].denominator);
            Store.storeInt64(address(this), itemSlot++, 16, tokenInfo.royaltyFees[i].amount);
            Store.storeAddress(address(this), itemSlot, 0, tokenInfo.royaltyFees[i].tokenId);
            Store.storeBool(address(this), itemSlot++, 20, tokenInfo.royaltyFees[i].useHbarsForPayment);
            Store.storeAddress(address(this), itemSlot++, tokenInfo.royaltyFees[i].feeCollector);
        }
        slot += 1;

        // Ledger ID
        Store.storeString(address(this), slot++, tokenInfo.ledgerId);
    }

    function _getTokenInfo(string memory json) private returns (TokenInfo memory tokenInfo) {
        tokenInfo.token = _getHederaToken(json);
        tokenInfo.fixedFees = _getFixedFees(json);
        tokenInfo.fractionalFees = _getFractionalFees(json);
        tokenInfo.royaltyFees = _getRoyaltyFees(_sanitizeFeesStructure(json));
        tokenInfo.ledgerId = _getLedgerId();
        tokenInfo.defaultKycStatus = false; // not available in the fetched JSON from mirror node
        tokenInfo.totalSupply = int64(vm.parseInt(vm.parseJsonString(json, ".total_supply")));
        tokenInfo.deleted = vm.parseJsonBool(json, ".deleted");
        tokenInfo.pauseStatus = keccak256(bytes(vm.parseJsonString(json, ".pause_status"))) == keccak256(bytes("PAUSED"));
        return tokenInfo;
    }

    // In order to properly decode the bytes returned by the parseJson into the Solidity Structure, the full,
    // correct structure has to be provided in the input json, with all of the corresponding fields.
    function _sanitizeFeesStructure(string memory json) private pure returns (string memory) {
        return vm.replace(
            json,
            "\"fallback_fee\":null}",
            "\"fallback_fee\":{\"amount\":0,\"denominating_token_id\":\"\"}}"
        );
    }

    function _getHederaToken(string memory json) private returns (HederaToken memory token) {
        token.tokenKeys = _getTokenKeys(json);
        token.name = vm.parseJsonString(json, ".name");
        token.symbol = vm.parseJsonString(json, ".symbol");
        token.memo = vm.parseJsonString(json, ".memo");
        token.tokenSupplyType = keccak256(bytes(vm.parseJsonString(json, ".supply_type"))) == keccak256(bytes("FINITE"));
        token.maxSupply = int64(vm.parseInt(vm.parseJsonString(json, ".max_supply")));
        token.freezeDefault = vm.parseJsonBool(json, ".freeze_default");
        token.expiry.second = abi.decode(vm.parseJson(json, ".expiry_timestamp"), (int64)) / 1_000_000_000;

        try vm.parseJsonString(json, ".auto_renew_account") returns (string memory autoRenewAccount) {
            if (keccak256(bytes(autoRenewAccount)) != keccak256(bytes("null"))) {
                token.expiry.autoRenewAccount = mirrorNode().getAccountAddress(autoRenewAccount);
            }
        } catch {}

        try vm.parseJson(json, ".auto_renew_period") returns (bytes memory autoRenewPeriodBytes) {
            token.expiry.autoRenewPeriod = abi.decode(autoRenewPeriodBytes, (int64));
        } catch {}

        try vm.parseJsonString(json, ".treasury_account_id") returns (string memory treasuryAccountId) {
            if (keccak256(bytes(treasuryAccountId)) != keccak256(bytes("null"))) {
                token.treasury =  mirrorNode().getAccountAddress(treasuryAccountId);
            }
        } catch {}

        return token;
    }

    function _getTokenKeys(string memory json) private pure returns (TokenKey[] memory tokenKeys) {
        tokenKeys = new TokenKey[](7);

        try vm.parseJson(json, ".admin_key") returns (bytes memory keyBytes) {
            if (keccak256(keyBytes) != keccak256(abi.encodePacked(bytes32(0)))) {
                IMirrorNodeResponses.Key memory key = abi.decode(keyBytes, (IMirrorNodeResponses.Key));
                tokenKeys[0] = _getTokenKey(key, 0x1);
            }
        } catch {}

        try vm.parseJson(json, ".kyc_key") returns (bytes memory keyBytes) {
            if (keccak256(keyBytes) != keccak256(abi.encodePacked(bytes32(0)))) {
                IMirrorNodeResponses.Key memory key = abi.decode(keyBytes, (IMirrorNodeResponses.Key));
                tokenKeys[1] = _getTokenKey(key, 0x2);
            }
        } catch {}

        try vm.parseJson(json, ".freeze_key") returns (bytes memory keyBytes) {
            if (keccak256(keyBytes) != keccak256(abi.encodePacked(bytes32(0)))) {
                IMirrorNodeResponses.Key memory key = abi.decode(keyBytes, (IMirrorNodeResponses.Key));
                tokenKeys[2] = _getTokenKey(key, 0x4);
            }
        } catch {}

        try vm.parseJson(json, ".wipe_key") returns (bytes memory keyBytes) {
            if (keccak256(keyBytes) != keccak256(abi.encodePacked(bytes32(0)))) {
                IMirrorNodeResponses.Key memory key = abi.decode(keyBytes, (IMirrorNodeResponses.Key));
                tokenKeys[3] = _getTokenKey(key, 0x8);
            }
        } catch {}

        try vm.parseJson(json, ".supply_key") returns (bytes memory keyBytes) {
            if (keccak256(keyBytes) != keccak256(abi.encodePacked(bytes32(0)))) {
                IMirrorNodeResponses.Key memory key = abi.decode(keyBytes, (IMirrorNodeResponses.Key));
                tokenKeys[4] = _getTokenKey(key, 0x10);
            }
        } catch {}

        try vm.parseJson(json, ".fee_schedule_key") returns (bytes memory keyBytes) {
            if (keccak256(keyBytes) != keccak256(abi.encodePacked(bytes32(0)))) {
                IMirrorNodeResponses.Key memory key = abi.decode(keyBytes, (IMirrorNodeResponses.Key));
                tokenKeys[5] = _getTokenKey(key, 0x20);
            }
        } catch {}

        try vm.parseJson(json, ".pause_key") returns (bytes memory keyBytes) {
            if (keccak256(keyBytes) != keccak256(abi.encodePacked(bytes32(0)))) {
                IMirrorNodeResponses.Key memory key = abi.decode(keyBytes, (IMirrorNodeResponses.Key));
                tokenKeys[6] = _getTokenKey(key, 0x40);
            }
        } catch {}

        return tokenKeys;
    }

    function _getTokenKey(IMirrorNodeResponses.Key memory key, uint8 keyType) internal pure returns (TokenKey memory) {
        bool inheritAccountKey = false;
        address contractId = address(0);
        address delegatableContractId = address(0);
        bytes memory ed25519 = keccak256(bytes(key._type)) == keccak256(bytes("ED25519"))
            ? vm.parseBytes(key.key)
            : new bytes(0);
        bytes memory ECDSA_secp256k1 = keccak256(bytes(key._type)) == keccak256(bytes("ECDSA_SECP256K1"))
            ? vm.parseBytes(key.key)
            : new bytes(0);
        return TokenKey(
            keyType,
            KeyValue(
                inheritAccountKey,
                contractId,
                ed25519,
                ECDSA_secp256k1,
                delegatableContractId
            )
        );
    }

    function _getFixedFees(string memory json) private returns (FixedFee[] memory) {
        if (!vm.keyExistsJson(json, ".custom_fees.fixed_fees")) {
            return new FixedFee[](0);
        }

        try vm.parseJson(json, ".custom_fees.fixed_fees") returns (bytes memory fixedFeesBytes) {
            if (fixedFeesBytes.length == 0) {
                return new FixedFee[](0);
            }
            IMirrorNodeResponses.FixedFee[] memory fees = abi.decode(fixedFeesBytes, (IMirrorNodeResponses.FixedFee[]));
            FixedFee[] memory fixedFees = new FixedFee[](fees.length);
            for (uint i = 0; i < fees.length; i++) {
                string memory path = vm.replace(".custom_fees.fixed_fees[{i}]", "{i}", vm.toString(i));
                address denominatingToken = mirrorNode().getAccountAddress(vm.parseJsonString(json, Str.concat(path, ".denominating_token_id")));
                fixedFees[i] = FixedFee(
                    int64(vm.parseJsonInt(json, Str.concat(path, ".amount"))),
                    denominatingToken,
                    denominatingToken == address(0),
                    denominatingToken == address(this),
                    mirrorNode().getAccountAddress(vm.parseJsonString(json, Str.concat(path, ".collector_account_id")))
                );
            }
            return fixedFees;
        } catch {
            // Do nothing
            return new FixedFee[](0);
        }
    }

    function _getFractionalFees(string memory json) private returns (FractionalFee[] memory) {
        if (!vm.keyExistsJson(json, ".custom_fees.fractional_fees")) {
            return new FractionalFee[](0);
        }

        try vm.parseJson(json, ".custom_fees.fractional_fees") returns (bytes memory fractionalFeesBytes) {
            if (fractionalFeesBytes.length == 0) {
                return new FractionalFee[](0);
            }
            IMirrorNodeResponses.FractionalFee[] memory fees = abi.decode(fractionalFeesBytes, (IMirrorNodeResponses.FractionalFee[]));
            FractionalFee[] memory fractionalFees = new FractionalFee[](fees.length);
            for (uint i = 0; i < fees.length; i++) {
                string memory path = vm.replace(".custom_fees.fractional_fees[{i}]", "{i}", vm.toString(i));
                fractionalFees[i] = FractionalFee(
                    int64(vm.parseJsonInt(json, Str.concat(path, ".amount.numerator"))),
                    int64(vm.parseJsonInt(json, Str.concat(path, ".amount.denominator"))),
                    int64(vm.parseJsonInt(json, Str.concat(path, ".minimum"))),
                    int64(vm.parseJsonInt(json, Str.concat(path, ".maximum"))),
                    vm.parseJsonBool(json, Str.concat(path, ".net_of_transfers")),
                    mirrorNode().getAccountAddress(vm.parseJsonString(json, Str.concat(path, ".collector_account_id")))
                );
            }
            return fractionalFees;
        } catch {
            // Do nothing
            return new FractionalFee[](0);
        }
    }

    function _getRoyaltyFees(string memory json) private returns (RoyaltyFee[] memory) {
        if (!vm.keyExistsJson(json, ".custom_fees.royalty_fees")) {
            return new RoyaltyFee[](0);
        }
        try vm.parseJson(json, ".custom_fees.royalty_fees") returns (bytes memory royaltyFeesBytes) {
            if (royaltyFeesBytes.length == 0) {
                return new RoyaltyFee[](0);
            }
            IMirrorNodeResponses.RoyaltyFee[] memory fees = abi.decode(royaltyFeesBytes, (IMirrorNodeResponses.RoyaltyFee[]));
            RoyaltyFee[] memory royaltyFees = new RoyaltyFee[](fees.length);
            for (uint i = 0; i < fees.length; i++) {
                string memory path = vm.replace(".custom_fees.royalty_fees[{i}]", "{i}", vm.toString(i));
                address collectorAccount = mirrorNode().getAccountAddress(vm.parseJsonString(json, Str.concat(path, ".collector_account_id")));
                bytes memory denominatingTokenBytes = vm.parseJson(json, Str.concat(path, ".denominating_token_id"));
                address denominatingToken;
                if (keccak256(denominatingTokenBytes) != keccak256("")) {
                    denominatingToken = mirrorNode().getAccountAddress(vm.parseJsonString(json, Str.concat(path, ".denominating_token_id")));
                }
                royaltyFees[i] = RoyaltyFee(
                    int64(vm.parseJsonInt(json, Str.concat(path, ".amount.numerator"))),
                    int64(vm.parseJsonInt(json, Str.concat(path, ".amount.denominator"))),
                    int64(vm.parseJsonInt(json, Str.concat(path, ".fallback_fee.amount"))),
                    denominatingToken,
                    collectorAccount == address(0),
                    collectorAccount
                );
            }
            return royaltyFees;
        } catch {
            return new RoyaltyFee[](0);
        }
    }

    function _getLedgerId() internal view returns (string memory) {
        if (block.chainid == 295) return "0x00"; // Mainnet
        if (block.chainid == 296) return "0x01"; // Testnet
        if (block.chainid == 297) return "0x02"; // Previewnet
        if (block.chainid == 298) return "0x03"; // Localhost
        return "0x00"; // Default to Mainnet
    }

    function _balanceOfSlot(address account) internal override returns (bytes32) {
        bytes32 slot = super._balanceOfSlot(account);
        if (_shouldFetch(slot)) {
            uint256 amount = mirrorNode().getBalance(address(this), account);
            _setValue(slot, bytes32(amount));
        }
        return slot;
    }

    function _allowanceSlot(address owner, address spender) internal override returns (bytes32) {
        bytes32 slot = super._allowanceSlot(owner, spender);
        if (_shouldFetch(slot)) {
            uint256 amount = mirrorNode().getAllowance(address(this), owner, spender);
            _setValue(slot, bytes32(amount));
        }
        return slot;
    }

    function _isAssociatedSlot(address account, bool revertIfNotExists) internal override returns (bytes32) {
        bytes32 slot = super._isAssociatedSlot(account, revertIfNotExists);
        if (_shouldFetch(slot)) {
            bool associated = mirrorNode().isAssociated(address(this), account);
            _setValue(slot, bytes32(uint256(associated ? 1 : 0)));
        }
        return slot;
    }

    function _tokenUriSlot(uint32 serialId) internal override virtual returns (bytes32) {
        bytes32 slot = super._tokenUriSlot(serialId);
        if (_shouldFetch(slot)) {
            string memory metadata = mirrorNode().getNftMetadata(address(this), serialId);
            string memory uri = string(decode(metadata));
            Store.storeString(address(this), uint256(slot), uri);
        }
        return slot;
    }

    function _ownerOfSlot(uint32 serialId) internal override virtual returns (bytes32) {
        bytes32 slot = super._ownerOfSlot(serialId);
        if (_shouldFetch(slot)) {
            address owner = mirrorNode().getNftOwner(address(this), serialId);
            _setValue(slot, bytes32(uint256(uint160(owner))));
        }
        return slot;
    }

    function _getApprovedSlot(uint32 serialId) internal override virtual returns (bytes32) {
        bytes32 slot = super._getApprovedSlot(serialId);
        if (_shouldFetch(slot)) {
            address approved = mirrorNode().getNftSpender(address(this), serialId);
            _setValue(slot, bytes32(uint256(uint160(approved))));
        }
        return slot;
    }

    function _isApprovedForAllSlot(address owner, address operator) internal override virtual returns (bytes32) {
        bytes32 slot = super._isApprovedForAllSlot(owner, operator);
        if (_shouldFetch(slot)) {
            bool approved = mirrorNode().isApprovedForAll(address(this), owner, operator);
            _setValue(slot, bytes32(uint256(approved ? 1 : 0)));
        }
        return slot;
    }

    function _shouldFetch(bytes32 slot) private view returns (bool) {
        return vm.load(address(this), _isLocalTokenSlot) == bytes32(0)
            && vm.load(_scratchAddr(), slot) == bytes32(0);
    }

    function _setValue(bytes32 slot, bytes32 value) private {
        vm.store(address(this), slot, value);
        vm.store(_scratchAddr(), slot, bytes32(uint(1)));
    }

    function _scratchAddr() private view returns (address) {
        return address(bytes20(keccak256(abi.encode(address(this)))));
    }
}
