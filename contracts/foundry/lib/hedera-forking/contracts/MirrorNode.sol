// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "./IMirrorNodeResponses.sol";
import {Vm} from "forge-std/Vm.sol";

abstract contract MirrorNode {

    Vm internal constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    /**
     * @dev Requires that `token` address is a valid HTS token address.
     * That is, that is no greater than MAX value of `uint32`.
     * Technically, AccountNum is 64 bits, but here constraint them to 32 bits.
     */
    modifier isValid(address token) {
        require((uint160(token) >> 32) == 0, "Invalid token address");
        _;
    }

    function fetchTokenData(address token) external virtual returns (string memory json);

    function fetchBalance(address token, uint32 accountNum) external virtual returns (string memory json);

    function fetchAllowance(address token, uint32 ownerNum, uint32 spenderNum) external virtual returns (string memory json);

    function fetchNftAllowance(address token, uint32 ownerNum, uint32 operatorNum) external virtual returns (string memory json);

    function fetchAccount(string memory account) external virtual returns (string memory json);

    function fetchTokenRelationshipOfAccount(string memory account, address token) external virtual returns (string memory json);

    function fetchNonFungibleToken(address token, uint32 serial) external virtual returns (string memory json);

    function getNftMetadata(address token, uint32 serial) external returns (string memory) {
        string memory json = this.fetchNonFungibleToken(token, serial);
        if (vm.keyExistsJson(json, ".metadata")) {
            return vm.parseJsonString(json, ".metadata");
        }
        return "";
    }

    function getNftOwner(address token, uint32 serial) external returns (address) {
        string memory json = this.fetchNonFungibleToken(token, serial);
        if (vm.keyExistsJson(json, ".account_id")) {
            string memory owner = vm.parseJsonString(json, ".account_id");
            return getAccountAddress(owner);
        }
        return address(0);
    }

    function getNftSpender(address token, uint32 serial) external returns (address) {
        string memory json = this.fetchNonFungibleToken(token, serial);
        if (vm.keyExistsJson(json, ".spender")) {
            string memory spender = vm.parseJsonString(json, ".spender");
            return getAccountAddress(spender);
        }
        return address(0);
    }

    function isApprovedForAll(address token, address owner, address operator) external returns (bool) {
        uint32 ownerNum = _getAccountNum(owner);
        if (ownerNum == 0) return false;
        uint32 operatorNum = _getAccountNum(operator);
        if (operatorNum == 0) return false;
        string memory json = this.fetchNftAllowance(token, ownerNum, operatorNum);
        return vm.keyExistsJson(json, ".allowances[0].approved_for_all")
            && vm.parseJsonBool(json, ".allowances[0].approved_for_all");
    }

    function getBalance(address token, address account) external returns (uint256) {
        uint32 accountNum = _getAccountNum(account);
        if (accountNum == 0) return 0;
        string memory json = this.fetchBalance(token, accountNum);
        if (vm.keyExistsJson(json, ".balances[0].balance")) {
            return vm.parseJsonUint(json, ".balances[0].balance");
        }
        return 0;
    }

    function getAllowance(address token, address owner, address spender) external returns (uint256) {
        uint32 ownerNum = _getAccountNum(owner);
        if (ownerNum == 0) return 0;
        uint32 spenderNum = _getAccountNum(spender);
        if (spenderNum == 0) return 0;
        string memory json = this.fetchAllowance(token, ownerNum, spenderNum);
        if (vm.keyExistsJson(json, ".allowances[0].amount")) {
            return vm.parseJsonUint(json, ".allowances[0].amount");
        }
        return 0;
    }

    function isAssociated(address token, address account) external returns (bool) {
        try this.fetchTokenRelationshipOfAccount(vm.toString(account), token) returns (string memory json) {
            if (vm.keyExistsJson(json, ".tokens")) {
                bytes memory tokens = vm.parseJson(json, ".tokens");
                IMirrorNodeResponses.TokenRelationship[] memory relationships = abi.decode(tokens, (IMirrorNodeResponses.TokenRelationship[]));
                return relationships.length > 0;
            }
        } catch {}
        return false;
    }

    function getAccountAddress(string memory accountId) public returns (address) {
        if (bytes(accountId).length == 0
        || keccak256(bytes(accountId)) == keccak256(bytes("null"))
            || keccak256(abi.encodePacked(accountId)) == keccak256(abi.encodePacked(bytes32(0)))) {
            return address(0);
        }

        try this.fetchAccount(accountId) returns (string memory json) {
            if (vm.keyExistsJson(json, ".evm_address")) {
                return vm.parseJsonAddress(json, ".evm_address");
            }
        } catch {
            // Do nothing
        }

        // ignore the first 4 characters ("0.0.") to get the account number string
        require(bytes(accountId).length > 4, "Invalid account ID");
        uint32 accountNum = uint32(vm.parseUint(vm.replace(accountId, "0.0.", "")));

        // generate a deterministic address based on the account number as a fallback
        return address(uint160(accountNum));
    }

    // Lets store the response somewhere in order to prevent multiple calls for the same account id
    function _getAccountNum(address account) private returns (uint32) {
        if ((uint160(account) >> 32) == 0) {
            return uint32(uint160(account));
        }

        try this.fetchAccount(vm.toString(account)) returns (string memory json) {
            if (vm.keyExistsJson(json, ".account")) {
                return uint32(vm.parseUint(vm.replace(vm.parseJsonString(json, ".account"), "0.0.", "")));
            }
        } catch {}

        return 0;
    }
}
