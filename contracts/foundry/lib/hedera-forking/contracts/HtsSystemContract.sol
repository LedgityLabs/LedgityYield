// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import {IERC20} from "./IERC20.sol";
import {IERC721} from "./IERC721.sol";
import {IHRC719} from "./IHRC719.sol";
import {IHederaTokenService} from "./IHederaTokenService.sol";
import {HederaResponseCodes} from "./HederaResponseCodes.sol";
import {KeyLib} from "./KeyLib.sol";

address constant HTS_ADDRESS = address(0x167);

// Event definitions from both `IERC20` and `IERC721` cannot be used here because
// `solc` does not permit to use qualified access to events in foreign interfaces.
// This feature was added in `solc` `0.8.21`.
// See _Qualified access to foreign events_ https://soliditylang.org/blog/2023/07/19/solidity-0.8.21-release-announcement/.
// However, we cannot use this feature because library users might not be able to use this version.
//
// On the other hand, the `Transfer` and `Approval` events from ERC20 and ERC721 only differ
// in the `amount` not being `indexed` whereas `tokenId` argument is `indexed`.
// `indexed` arguments are not part of the `event` signature,
// meaning that for `solc` both events are the same definition.
// That is why we cannot put these events in the `HtsSystemContract` directly.
//
// We cannot remove these events from `IERC20` and `IERC721` interfaces because that would violate their definition.
// Event definitions must be duplicated here and put in libraries so they can be reused by tests.

library IERC20Events {
    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);
}

library IERC721Events {
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}

contract HtsSystemContract is IHederaTokenService {

    /**
     * The slot's value contains the next token ID to use when a token is being created.
     *
     * This slot is used in the `0x167` address.
     * It cannot be used as a state variable directly.
     * This is because JS' `getHtsStorageAt` implementation assumes all state variables
     * declared here are part of the token address space.
     */
    bytes32 private constant _nextTokenIdSlot = keccak256("HtsSystemContract::_nextTokenIdSlot");

    // All state variables belong to an instantiated Fungible/Non-Fungible token.
    // These state variables are accessed with a `delegatecall` from the Token Proxy bytecode.
    // That is, they live in the token address storage space, not in the space of HTS `0x167`.
    // See `__redirectForToken` for more details.
    string internal tokenType;
    uint8 internal decimals;
    TokenInfo internal _tokenInfo;

    /**
     * @dev Prevents delegatecall into the modified method.
     */
    modifier htsCall() {
        require(address(this) == HTS_ADDRESS, "htsCall: delegated call");
        _;
    }

    /**
     * @dev Returns the Account ID and a flag indicating whether the account exists on the forked network (if any).
     * - `accountId` a `uint32` representing the Account ID (excluding both shard and realm numbers) for the given `address`.
     *   The storage adapter, _i.e._, `getHtsStorageAt`, assumes that both shard and realm
     *   numbers are zero, allowing them to be omitted from the Account ID.
     * - `exists` a boolean flag indicating whether the account exists on the forked network.
     *
     * See https://docs.hedera.com/hedera/core-concepts/accounts/account-properties
     * for more info on account properties.
     */
    function getAccountId(address account) htsCall external view returns (uint32 accountId, bool exists) {
        bytes32 slot = _getAccountIdSlot(account);
        bytes32 value;
        assembly { value := sload(slot) }
        accountId = uint32(uint256(value));
        exists = uint8(value[0]) == 1;
    }

    function _getAccountIdSlot(address account) internal virtual view returns (bytes32) {
        bytes4 selector = this.getAccountId.selector;
        uint64 pad = 0x0;
        return bytes32(abi.encodePacked(selector, pad, account));
    }

    function mintToken(address token, int64 amount, bytes[] memory) htsCall external override returns (
        int64 responseCode,
        int64 newTotalSupply,
        int64[] memory serialNumbers
    ) {
        return _mintToken(token, amount, true);
    }

    function _mintToken(address token, int64 amount, bool checkSupplyKey) private returns (
        int64 responseCode,
        int64 newTotalSupply,
        int64[] memory serialNumbers
    ) {
        require(token != address(0), "mintToken: invalid token");
        require(amount > 0, "mintToken: invalid amount");

        (int64 tokenInfoResponseCode, TokenInfo memory tokenInfo) = IHederaTokenService(token).getTokenInfo(token);
        if (checkSupplyKey && !KeyLib.keyExists(0x10, tokenInfo)) { // 0x10 - supply key
            return (HederaResponseCodes.TOKEN_HAS_NO_SUPPLY_KEY, tokenInfo.totalSupply, new int64[](0));
        }
        require(tokenInfoResponseCode == HederaResponseCodes.SUCCESS, "mintToken: failed to get token info");

        address treasuryAccount = tokenInfo.token.treasury;
        require(treasuryAccount != address(0), "mintToken: invalid account");

        HtsSystemContract(token)._update(address(0), treasuryAccount, uint256(uint64(amount)));

        responseCode = HederaResponseCodes.SUCCESS;
        newTotalSupply = int64(uint64(IERC20(token).totalSupply()));
        serialNumbers = new int64[](0);
        require(newTotalSupply >= 0, "mintToken: invalid total supply");
    }

    function burnToken(address token, int64 amount, int64[] memory) htsCall external override returns (
        int64 responseCode,
        int64 newTotalSupply
    ) {
        require(token != address(0), "burnToken: invalid token");
        require(amount > 0, "burnToken: invalid amount");

        (int64 tokenInfoResponseCode, TokenInfo memory tokenInfo) = IHederaTokenService(token).getTokenInfo(token);
        if (!KeyLib.keyExists(0x10, tokenInfo)) {
            return (HederaResponseCodes.TOKEN_HAS_NO_SUPPLY_KEY, tokenInfo.totalSupply);
        }
        require(tokenInfoResponseCode == HederaResponseCodes.SUCCESS, "burnToken: failed to get token info");

        address treasuryAccount = tokenInfo.token.treasury;
        require(treasuryAccount != address(0), "burnToken: invalid account");

        HtsSystemContract(token)._update(treasuryAccount, address(0), uint256(uint64(amount)));

        responseCode = HederaResponseCodes.SUCCESS;
        newTotalSupply = int64(uint64(IERC20(token).totalSupply()));
        require(newTotalSupply >= 0, "burnToken: invalid total supply");
    }

    function associateTokens(address account, address[] memory tokens) htsCall public override returns (int64 responseCode) {
        require(tokens.length > 0, "associateTokens: missing tokens");
        require(
            account == msg.sender,
            "associateTokens: Must be signed by the provided Account's key or called from the accounts contract key"
        );
        for (uint256 i = 0; i < tokens.length; i++) {
            require(tokens[i] != address(0), "associateTokens: invalid token");
            int64 associationResponseCode = IHederaTokenService(tokens[i]).associateToken(account, tokens[i]);
            require(
                associationResponseCode == HederaResponseCodes.SUCCESS,
                "associateTokens: Failed to associate token"
            );
        }
        responseCode = HederaResponseCodes.SUCCESS;
    }

    function associateToken(address account, address token) htsCall external override returns (int64 responseCode) {
        address[] memory tokens = new address[](1);
        tokens[0] = token;
        return associateTokens(account, tokens);
    }

    function dissociateTokens(address account, address[] memory tokens) htsCall public override returns (int64 responseCode) {
        require(tokens.length > 0, "dissociateTokens: missing tokens");
        require(account == msg.sender, "dissociateTokens: Must be signed by the provided Account's key or called from the accounts contract key");
        for (uint256 i = 0; i < tokens.length; i++) {
            require(tokens[i] != address(0), "dissociateTokens: invalid token");
            int64 dissociationResponseCode = IHederaTokenService(tokens[i]).dissociateToken(account, tokens[i]);
            require(dissociationResponseCode == HederaResponseCodes.SUCCESS, "dissociateTokens: Failed to dissociate token");
        }
        responseCode = HederaResponseCodes.SUCCESS;
    }

    function dissociateToken(address account, address token) htsCall external override returns (int64 responseCode) {
        address[] memory tokens = new address[](1);
        tokens[0] = token;
        return dissociateTokens(account, tokens);
    }

    /**
     * The side effect of this function is to "deploy" proxy bytecode at `tokenAddress`.
     * The `sload` will trigger a `eth_getStorageAt` in the Forwarder that enables the
     * proxy bytecode at `tokenAddress`.
     */
    function deployHIP719Proxy(address tokenAddress) virtual internal {
        bytes4 selector = 0x400f4ef3; // cast sig 'deployHIP719Proxy(address)'
        bytes32 slot = bytes32(abi.encodePacked(selector, uint64(0), tokenAddress));
        // add `sstore` to avoid `sload` from getting optimized away
        assembly { sstore(slot, add(sload(slot), 1)) }
    }

    function _createToken(
        string memory tokenType_,
        HederaToken memory token,
        int64 initialTotalSupply,
        int32 decimals_,
        FixedFee[] memory fixedFees,
        FractionalFee[] memory fractionalFees,
        RoyaltyFee[] memory royaltyFees
    ) private returns (int64 responseCode, address tokenAddress) {
        require(msg.value > 0, "HTS: must send HBARs");
        require(bytes(token.name).length > 0, "HTS: name cannot be empty");
        require(bytes(token.symbol).length > 0, "HTS: symbol cannot be empty");
        require(token.treasury != address(0), "HTS: treasury cannot be zero-address");
        require(initialTotalSupply >= 0, "HTS: initialTotalSupply cannot be negative");
        require(decimals_ >= 0, "HTS: decimals cannot be negative");

        TokenInfo memory tokenInfo;
        tokenInfo.token = token;
        tokenInfo.totalSupply = 0;
        tokenInfo.deleted = false;
        tokenInfo.defaultKycStatus = true;
        tokenInfo.pauseStatus = false;
        tokenInfo.fixedFees = fixedFees;
        tokenInfo.fractionalFees = fractionalFees;
        tokenInfo.royaltyFees = royaltyFees;
        tokenInfo.ledgerId = "0x03";

        bytes32 nextTokenIdSlot = _nextTokenIdSlot;
        uint160 nextTokenId;
        assembly { nextTokenId := sload(nextTokenIdSlot) }
        if (nextTokenId == 0) {
            nextTokenId = 1031;
        }
        nextTokenId++;
        assembly { sstore(nextTokenIdSlot, nextTokenId) }

        tokenAddress = address(nextTokenId);

        deployHIP719Proxy(tokenAddress);
        HtsSystemContract(tokenAddress).__setTokenInfo(tokenType_, tokenInfo, decimals_);

        if (initialTotalSupply > 0) {
            _mintToken(tokenAddress, initialTotalSupply, false);
        }

        responseCode = HederaResponseCodes.SUCCESS;
    }

    function createFungibleToken(
        HederaToken memory token,
        int64 initialTotalSupply,
        int32 decimals_
    ) htsCall external override payable returns (int64 responseCode, address tokenAddress) {
        FixedFee[] memory fixedFees = new FixedFee[](0);
        FractionalFee[] memory fractionalFees = new FractionalFee[](0);
        RoyaltyFee[] memory royaltyFees = new RoyaltyFee[](0);
        return _createToken("FUNGIBLE_COMMON", token, initialTotalSupply, decimals_, fixedFees, fractionalFees, royaltyFees);
    }

    function createFungibleTokenWithCustomFees(
        HederaToken memory token,
        int64 initialTotalSupply,
        int32 decimals_,
        FixedFee[] memory fixedFees,
        FractionalFee[] memory fractionalFees
    ) htsCall external override payable returns (int64 responseCode, address tokenAddress) {
        RoyaltyFee[] memory royaltyFees = new RoyaltyFee[](0);
        return _createToken("FUNGIBLE_COMMON", token, initialTotalSupply, decimals_, fixedFees, fractionalFees, royaltyFees);
    }

    function createNonFungibleToken(
        HederaToken memory token
    ) htsCall external override payable returns (int64 responseCode, address tokenAddress) {
        FixedFee[] memory fixedFees = new FixedFee[](0);
        FractionalFee[] memory fractionalFees = new FractionalFee[](0);
        RoyaltyFee[] memory royaltyFees = new RoyaltyFee[](0);
        return _createToken("NON_FUNGIBLE_UNIQUE", token, 0, 0, fixedFees, fractionalFees, royaltyFees);
    }

    function createNonFungibleTokenWithCustomFees(
        HederaToken memory token,
        FixedFee[] memory fixedFees,
        RoyaltyFee[] memory royaltyFees
    ) htsCall external override payable returns (int64 responseCode, address tokenAddress) {
        FractionalFee[] memory fractionalFees = new FractionalFee[](0);
        return _createToken("NON_FUNGIBLE_UNIQUE", token, 0, 0, fixedFees, fractionalFees, royaltyFees);
    }

    function transferTokens(
        address token,
        address[] memory accountId,
        int64[] memory amount
    ) htsCall external override returns (int64 responseCode) {
        require(token != address(0), "transferTokens: invalid token");
        require(accountId.length > 0, "transferTokens: missing recipients");
        require(amount.length == accountId.length, "transferTokens: inconsistent input");
        for (uint256 i = 0; i < accountId.length; i++) {
            responseCode = transferToken(token, msg.sender, accountId[i], amount[i]);
            require(responseCode == HederaResponseCodes.SUCCESS, "transferTokens: transfer failed");
        }
        responseCode = HederaResponseCodes.SUCCESS;
    }

    function transferNFTs(
        address token,
        address[] memory sender,
        address[] memory receiver,
        int64[] memory serialNumber
    ) htsCall external override returns (int64 responseCode) {
        require(token != address(0), "transferNFTs: invalid token");
        require(sender.length > 0, "transferNFTs: missing recipients");
        require(receiver.length == sender.length, "transferNFTs: inconsistent input");
        require(serialNumber.length == sender.length, "transferNFTs: inconsistent input");
        for (uint256 i = 0; i < sender.length; i++) {
            transferNFT(token, sender[i], receiver[i], serialNumber[i]);
        }
        responseCode = HederaResponseCodes.SUCCESS;
    }

    function transferToken(
        address token,
        address sender,
        address recipient,
        int64 amount
    ) htsCall public override returns (int64 responseCode) {
        require(token != address(0), "transferToken: invalid token");
        address from = sender;
        address to = recipient;
        if (amount < 0) {
            from = recipient;
            to = sender;
            amount *= -1;
        }
        require(
            from == msg.sender ||
            IERC20(token).allowance(from, msg.sender) >= uint256(uint64(amount)),
            "transferNFT: unauthorized"
        );
        HtsSystemContract(token).transferFrom(msg.sender, from, to, uint256(uint64(amount)));
        responseCode = HederaResponseCodes.SUCCESS;
    }

    function transferNFT(
        address token,
        address sender,
        address recipient,
        int64 serialNumber
    ) htsCall public override returns (int64 responseCode) {
        uint256 serialId = uint256(uint64(serialNumber));
        HtsSystemContract(token).transferFromNFT(msg.sender, sender, recipient, serialId);
        responseCode = HederaResponseCodes.SUCCESS;
    }

    function approve(address token, address spender, uint256 amount) htsCall public override returns (int64 responseCode) {
        HtsSystemContract(token).approve(msg.sender, spender, amount);
        responseCode = HederaResponseCodes.SUCCESS;
    }

    function transferFrom(
        address token,
        address sender,
        address recipient,
        uint256 amount
    ) htsCall external override returns (int64) {
        return transferToken(token, sender, recipient, int64(int256(amount)));
    }

    function allowance(address token, address owner, address spender) htsCall external override view returns (int64, uint256) {
        return (HederaResponseCodes.SUCCESS, IERC20(token).allowance(owner, spender));
    }

    function approveNFT(
        address token,
        address approved,
        uint256 serialNumber
    ) htsCall public override returns (int64 responseCode) {
        HtsSystemContract(token).approveNFT(msg.sender, approved, serialNumber);
        responseCode = HederaResponseCodes.SUCCESS;
    }

    function transferFromNFT(
        address token,
        address from,
        address to,
        uint256 serialNumber
    ) htsCall external override returns (int64) {
        return transferNFT(token, from, to, int64(int256(serialNumber)));
    }

    function getApproved(address token, uint256 serialNumber)
        htsCall external override view returns (int64 responseCode, address approved) {
        require(token != address(0), "getApproved: invalid token");
        (responseCode, approved) = (HederaResponseCodes.SUCCESS, IERC721(token).getApproved(serialNumber));
    }

    function setApprovalForAll(
        address token,
        address operator,
        bool approved
    ) htsCall external override returns (int64 responseCode) {
        HtsSystemContract(token).setApprovalForAll(msg.sender, operator, approved);
        responseCode = HederaResponseCodes.SUCCESS;
    }

    function isApprovedForAll(
        address token,
        address owner,
        address operator
    ) htsCall external override view returns (int64, bool) {
        require(token != address(0), "isApprovedForAll: invalid token");
        return (HederaResponseCodes.SUCCESS, IERC721(token).isApprovedForAll(owner, operator));
    }

    function getTokenCustomFees(
        address token
    ) htsCall external override view returns (int64, FixedFee[] memory, FractionalFee[] memory, RoyaltyFee[] memory) {
        (int64 responseCode, TokenInfo memory tokenInfo) = getTokenInfo(token);
        return (responseCode, tokenInfo.fixedFees, tokenInfo.fractionalFees, tokenInfo.royaltyFees);
    }

    function getTokenDefaultFreezeStatus(address token) htsCall external override view returns (int64, bool) {
        (int64 responseCode, TokenInfo memory tokenInfo) = getTokenInfo(token);
        return (responseCode, tokenInfo.token.freezeDefault);
    }

    function getTokenDefaultKycStatus(address token) htsCall external override view returns (int64, bool) {
        (int64 responseCode, TokenInfo memory tokenInfo) = getTokenInfo(token);
        return (responseCode, tokenInfo.defaultKycStatus);
    }

    function getTokenExpiryInfo(address token) htsCall external override view returns (int64, Expiry memory expiry) {
        (int64 responseCode, TokenInfo memory tokenInfo) = getTokenInfo(token);
        return (responseCode, tokenInfo.token.expiry);
    }

    function getFungibleTokenInfo(address token) htsCall external override view returns (int64, FungibleTokenInfo memory) {
        (int64 responseCode, TokenInfo memory tokenInfo) = getTokenInfo(token);
        require(responseCode == HederaResponseCodes.SUCCESS, "getFungibleTokenInfo: failed to get token data");
        FungibleTokenInfo memory fungibleTokenInfo;
        fungibleTokenInfo.tokenInfo = tokenInfo;
        fungibleTokenInfo.decimals =  int32(int8(IERC20(token).decimals()));

        return (responseCode, fungibleTokenInfo);
    }

    function getTokenInfo(address token) htsCall public override view returns (int64, TokenInfo memory) {
        require(token != address(0), "getTokenInfo: invalid token");

        return IHederaTokenService(token).getTokenInfo(token);
    }

    function getTokenKey(address token, uint keyType) htsCall external override view returns (int64, KeyValue memory) {
        (int64 responseCode, TokenInfo memory tokenInfo) = getTokenInfo(token);
        require(responseCode == HederaResponseCodes.SUCCESS, "getTokenKey: failed to get token data");
        for (uint256 i = 0; i < tokenInfo.token.tokenKeys.length; i++) {
            if (tokenInfo.token.tokenKeys[i].keyType == keyType) {
                return (HederaResponseCodes.SUCCESS, tokenInfo.token.tokenKeys[i].key);
            }
        }
        KeyValue memory emptyKey;
        return (HederaResponseCodes.SUCCESS, emptyKey);
    }

    function getNonFungibleTokenInfo(address token, int64 serialNumber)
        htsCall external override view
        returns (int64, NonFungibleTokenInfo memory) {
        (int64 responseCode, TokenInfo memory tokenInfo) = getTokenInfo(token);
        require(responseCode == HederaResponseCodes.SUCCESS, "getNonFungibleTokenInfo: failed to get token data");
        NonFungibleTokenInfo memory nonFungibleTokenInfo;
        nonFungibleTokenInfo.tokenInfo = tokenInfo;
        nonFungibleTokenInfo.serialNumber = serialNumber;
        nonFungibleTokenInfo.spenderId = IERC721(token).getApproved(uint256(uint64(serialNumber)));
        nonFungibleTokenInfo.ownerId = IERC721(token).ownerOf(uint256(uint64(serialNumber)));

        // ToDo:
        // nonFungibleTokenInfo.metadata = bytes(IERC721(token).tokenURI(uint256(uint64(serialNumber))));
        // nonFungibleTokenInfo.creationTime = int64(0);

        return (responseCode, nonFungibleTokenInfo);
    }

    function isToken(address token) htsCall external override view returns (int64, bool) {
        bytes memory payload = abi.encodeWithSignature("getTokenType(address)", token);
        (bool success, bytes memory returnData) = token.staticcall(payload);
        return (HederaResponseCodes.SUCCESS, success && returnData.length > 0);
    }

    function getTokenType(address token) htsCall external override view returns (int64, int32) {
        require(token != address(0), "getTokenType: invalid address");
        return IHederaTokenService(token).getTokenType(token);
    }

    /**
     * @dev Validates `redirectForToken(address,bytes)` dispatcher arguments.
     *
     * The interaction between tokens and HTS System Contract is specified in
     * https://hips.hedera.com/hip/hip-218 and
     * https://hips.hedera.com/hip/hip-719.
     *
     * NOTE: The dispatcher **needs** to be implemented in the `fallback` function.
     * That is, it cannot be implemented as a regular `function`, _i.e._,
     * `function redirectForToken(address token, bytes encodedFunctionSelector) { ... }`.
     * The reason is that the arguments encoding of the Token Proxy, as defined in HIP-719,
     * is different from the Contract ABI Specification[1] arguments encoding.
     * In particular, the Contract ABI Specification states that `address`(`uint160`) is
     * **"padded on the higher-order (left) side with zero-bytes such that the length is 32 bytes"**.
     * Whereas HIP-719 encodes the `address` argument in the `redirectForToken` delegate call with no padding.
     *
     * To see that, we can analyze the HIP-719 Token Proxy fragment that encodes the arguments.
     * Please notice the `redirectForToken(address,bytes)` selector was replaced for clarity.
     *
     * ```yul
     * // (on the caller contract)
     * // calldata [ 0:..]: (bytes for encoded function call)
     * // Before execution
     * // memory   [ 0:32): 0x0
     *
     * mstore(0, 0x618dc65eFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFE)
     * // memory   [ 0:32): 0x0000000000000000618dc65eFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFE
     *
     * calldatacopy(32, 0, calldatasize())
     * // memory   [ 0:32): 0x0000000000000000618dc65eFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFE
     * // memory   [32:..): [bytes for encoded function call]
     *
     * let result := delegatecall(gas(), precompileAddress, 8, add(24, calldatasize()), 0, 0)
     * // (on the callee contract)
     * // calldata [ 0:24): 0x618dc65eFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFEFE
     * // calldata [24:..): [bytes for encoded function call]
     * ```
     *
     * Given the `address` is not left-padded, this encoding is incompatible with the
     * Contract ABI Specification, and hence a regular function cannot be used.
     *
     * Also notice that _currently_ we do not support direct calls to `redirectForToken`, _i.e._,
     * `address(0x167).redirectForToken(tokenAddr, bytesData)`.
     * The reason being direct calls read storage from `0x167` address.
     * But delegate calls on the other hand read storage from the token address.
     *
     * [1] https://docs.soliditylang.org/en/v0.8.23/abi-spec.html#function-selector-and-argument-encoding
     */
    fallback (bytes calldata) external returns (bytes memory) {
        // Calldata for a successful `redirectForToken(address,bytes)` call must contain
        // 00: 0x618dc65e (selector for `redirectForToken(address,bytes)`)
        // 04: 0xffffffffffffffffffffffffffffffffffffffff (token address which issue the `delegatecall`)
        // 24: 0xffffffff (selector for HTS method call)
        // 28: (bytes args for HTS method call, if any)
        require(msg.data.length >= 28, "fallback: not enough calldata");

        uint256 fallbackSelector = uint32(bytes4(msg.data[0:4]));
        require(fallbackSelector == 0x618dc65e, "fallback: unsupported selector");

        address token = address(bytes20(msg.data[4:24]));
        require(token == address(this), "fallback: token is not caller");

        // Even if the `__redirectForToken` method does not have any formal parameters,
        // it accesses the calldata arguments directly using `msg.data`.
        return __redirectForToken();
    }

    /**
     * @dev Addresses are word right-padded starting from memory position `28`.
     */
    function __redirectForToken() internal virtual returns (bytes memory) {
        bytes4 selector = bytes4(msg.data[24:28]);

        // If a token is being created locally, then there is not remote data to fetch.
        // That is why `__setTokenInfo` must be called before `_initTokenData`.
        if (msg.sender == HTS_ADDRESS && selector == this.__setTokenInfo.selector) {
            (string memory tokenType_, IHederaTokenService.TokenInfo memory tokenInfo, int32 decimals_) = abi.decode(msg.data[28:], (string, IHederaTokenService.TokenInfo, int32));
            __setTokenInfo(tokenType_, tokenInfo, decimals_);
            return abi.encode(true);
        }

        _initTokenData();

        if (keccak256(bytes(tokenType)) == keccak256(bytes("NOT_FOUND"))) {
            revert("redirectForToken: token not found");
        }

        // Internal redirects for HTS methods.
        if (msg.sender == HTS_ADDRESS) {
            if (selector == this.getTokenInfo.selector) {
                require(msg.data.length >= 28, "getTokenInfo: Not enough calldata");
                return abi.encode(HederaResponseCodes.SUCCESS, _tokenInfo);
            }
            if (selector == this.associateToken.selector) {
                require(msg.data.length >= 48, "associateToken: Not enough calldata");
                address account = address(bytes20(msg.data[40:60]));
                bytes32 slot = _isAssociatedSlot(account, false);
                assembly { sstore(slot, true) }
                return abi.encode(HederaResponseCodes.SUCCESS);
            }
            if (selector == this.dissociateToken.selector) {
                require(msg.data.length >= 48, "dissociateToken: Not enough calldata");
                address account = address(bytes20(msg.data[40:60]));
                bytes32 slot = _isAssociatedSlot(account, false);
                assembly { sstore(slot, false) }
                return abi.encode(HederaResponseCodes.SUCCESS);
            }
            if (selector == this.getTokenType.selector) {
                require(msg.data.length >= 28, "getTokenType: Not enough calldata");
                if (keccak256(abi.encodePacked(tokenType)) == keccak256("FUNGIBLE_COMMON")) {
                    return abi.encode(HederaResponseCodes.SUCCESS, int32(0));
                }
                if (keccak256(abi.encodePacked(tokenType)) == keccak256("NON_FUNGIBLE_UNIQUE")) {
                    return abi.encode(HederaResponseCodes.SUCCESS, int32(1));
                }
                return abi.encode(HederaResponseCodes.SUCCESS, int32(-1));
            }
            if (selector == this.transferFrom.selector) {
                require(msg.data.length >= 156, "transferFrom: Not enough calldata");
                address sender = address(bytes20(msg.data[40:60]));
                address from = address(bytes20(msg.data[72:92]));
                address to = address(bytes20(msg.data[104:124]));
                uint256 amount = uint256(bytes32(msg.data[124:156]));
                if (from != sender) {
                    _spendAllowance(from, sender, amount);
                }
                _transfer(from, to, amount);
                return abi.encode(true);
            }
            if (selector == this.transferFromNFT.selector) {
                require(msg.data.length >= 156, "transferFromNFT: Not enough calldata");
                address sender = address(bytes20(msg.data[40:60]));
                address from = address(bytes20(msg.data[72:92]));
                address to = address(bytes20(msg.data[104:124]));
                uint256 serialId = uint256(bytes32(msg.data[124:156]));
                _transferNFT(sender, from, to, serialId);
                return abi.encode(true);
            }
            if (selector == this.approve.selector) {
                require(msg.data.length >= 124, "approve: Not enough calldata");
                address from = address(bytes20(msg.data[40:60]));
                address to = address(bytes20(msg.data[72:92]));
                uint256 amount = uint256(bytes32(msg.data[92:124]));
                _approve(from, to, amount);
                emit IERC20Events.Approval(from, to, amount);
                return abi.encode(true);
            }
            if (selector == this.approveNFT.selector) {
                require(msg.data.length >= 124, "approveNFT: Not enough calldata");
                address from = address(bytes20(msg.data[40:60]));
                address to = address(bytes20(msg.data[72:92]));
                uint256 serialId = uint256(bytes32(msg.data[92:124]));
                _approve(from, to, serialId, true);
                return abi.encode(true);
            }
            if (selector == this.setApprovalForAll.selector) {
                require(msg.data.length >= 124, "setApprovalForAll: Not enough calldata");
                address from = address(bytes20(msg.data[40:60]));
                address to = address(bytes20(msg.data[72:92]));
                bool approved = uint256(bytes32(msg.data[92:124])) == 1;
                _setApprovalForAll(from, to, approved);
                return abi.encode(true);
            }
            if (selector == this._update.selector) {
                require(msg.data.length >= 124, "update: Not enough calldata");
                address from = address(bytes20(msg.data[40:60]));
                address to = address(bytes20(msg.data[72:92]));
                uint256 amount = uint256(bytes32(msg.data[92:124]));
                _update(from, to, amount);
                return abi.encode(true);
            }
        }

        // Redirect to the appropriate ERC20 method if the token type is fungible.
        if (keccak256(bytes(tokenType)) == keccak256(bytes("FUNGIBLE_COMMON"))) {
            return _redirectForERC20(selector);
        }

        // Redirect to the appropriate ERC721 method if the token type is non-fungible.
        if (keccak256(bytes(tokenType)) == keccak256(bytes("NON_FUNGIBLE_UNIQUE"))) {
            return _redirectForERC721(selector);
        }

        revert ("redirectForToken: token type not supported");
    }

    function _redirectForERC20(bytes4 selector) private returns (bytes memory) {
        if (selector == IERC20.name.selector) {
            return abi.encode(_tokenInfo.token.name);
        }
        if (selector == IERC20.decimals.selector) {
            return abi.encode(decimals);
        }
        if (selector == IERC20.totalSupply.selector) {
            return abi.encode(_tokenInfo.totalSupply);
        }
        if (selector == IERC20.symbol.selector) {
            return abi.encode(_tokenInfo.token.symbol);
        }
        if (selector == IERC20.balanceOf.selector) {
            require(msg.data.length >= 60, "balanceOf: Not enough calldata");

            address account = address(bytes20(msg.data[40:60]));
            return abi.encode(__balanceOf(account));
        }
        if (selector == IERC20.transfer.selector) {
            require(msg.data.length >= 92, "transfer: Not enough calldata");

            address to = address(bytes20(msg.data[40:60]));
            uint256 amount = uint256(bytes32(msg.data[60:92]));
            address owner = msg.sender;
            _transfer(owner, to, amount);
            return abi.encode(true);
        }
        if (selector == IERC20.transferFrom.selector) {
            require(msg.data.length >= 124, "transferF: Not enough calldata");

            address from = address(bytes20(msg.data[40:60]));
            address to = address(bytes20(msg.data[72:92]));
            uint256 amount = uint256(bytes32(msg.data[92:124]));
            address spender = msg.sender;

            _spendAllowance(from, spender, amount);
            _transfer(from, to, amount);
            return abi.encode(true);
        }
        if (selector == IERC20.allowance.selector) {
            require(msg.data.length >= 92, "allowance: Not enough calldata");

            address owner = address(bytes20(msg.data[40:60]));
            address spender = address(bytes20(msg.data[72:92]));
            return abi.encode(__allowance(owner, spender));
        }
        if (selector == IERC20.approve.selector) {
            require(msg.data.length >= 92, "approve: Not enough calldata");

            address spender = address(bytes20(msg.data[40:60]));
            uint256 amount = uint256(bytes32(msg.data[60:92]));
            address owner = msg.sender;
            _approve(owner, spender, amount);
            emit IERC20Events.Approval(owner, spender, amount);
            return abi.encode(true);
        }
        return _redirectForHRC719(selector);
    }

    function _redirectForERC721(bytes4 selector) private returns (bytes memory) {
        if (selector == IERC721.name.selector) {
            return abi.encode(_tokenInfo.token.name);
        }
        if (selector == IERC721.symbol.selector) {
            return abi.encode(_tokenInfo.token.symbol);
        }
        if (selector == IERC721.tokenURI.selector) {
            require(msg.data.length >= 60, "tokenURI: Not enough calldata");
            uint256 serialId = uint256(bytes32(msg.data[28:60]));
            return abi.encode(__tokenURI(serialId));
        }
        if (selector == IERC721.totalSupply.selector) {
            return abi.encode(_tokenInfo.totalSupply);
        }
        if (selector == IERC721.balanceOf.selector) {
            require(msg.data.length >= 60, "balanceOf: Not enough calldata");
            address owner = address(bytes20(msg.data[40:60]));
            return abi.encode(__balanceOf(owner));
        }
        if (selector == IERC721.ownerOf.selector) {
            require(msg.data.length >= 60, "ownerOf: Not enough calldata");
            uint256 serialId = uint256(bytes32(msg.data[28:60]));
            return abi.encode(__ownerOf(serialId));
        }
        if (selector == IERC721.transferFrom.selector) {
            require(msg.data.length >= 124, "transferFrom: Not enough calldata");
            address from = address(bytes20(msg.data[40:60]));
            address to = address(bytes20(msg.data[72:92]));
            uint256 serialId = uint256(bytes32(msg.data[92:124]));
            _transferNFT(msg.sender, from, to, serialId);
            return abi.encode(true);
        }
        if (selector == IERC721.approve.selector) {
            require(msg.data.length >= 92, "approve: Not enough calldata");
            address spender = address(bytes20(msg.data[40:60]));
            uint256 serialId = uint256(bytes32(msg.data[60:92]));
            _approve(msg.sender, spender, serialId, true);
            return abi.encode(true);
        }
        if (selector == IERC721.setApprovalForAll.selector) {
            require(msg.data.length >= 92, "setApprovalForAll: Not enough calldata");
            address operator = address(bytes20(msg.data[40:60]));
            bool approved = uint256(bytes32(msg.data[60:92])) == 1;
            _setApprovalForAll(msg.sender, operator, approved);
            return abi.encode(true);
        }
        if (selector == IERC721.getApproved.selector) {
            require(msg.data.length >= 60, "getApproved: Not enough calldata");
            uint256 serialId = uint256(bytes32(msg.data[28:60]));
            return abi.encode(__getApproved(serialId));
        }
        if (selector == IERC721.isApprovedForAll.selector) {
            require(msg.data.length >= 92, "isApprovedForAll: Not enough calldata");
            address owner = address(bytes20(msg.data[40:60]));
            address operator = address(bytes20(msg.data[72:92]));
            return abi.encode(__isApprovedForAll(owner, operator));
        }
        return _redirectForHRC719(selector);
    }

    function _redirectForHRC719(bytes4 selector) private returns (bytes memory) {
        if (selector == IHRC719.associate.selector) {
            bytes32 slot = _isAssociatedSlot(msg.sender, false);
            assembly { sstore(slot, true) }
            return abi.encode(true);
        }
        if (selector == IHRC719.dissociate.selector) {
            bytes32 slot = _isAssociatedSlot(msg.sender, false);
            assembly { sstore(slot, false) }
            return abi.encode(true);
        }
        if (selector == IHRC719.isAssociated.selector) {
            bytes32 slot = _isAssociatedSlot(msg.sender, true);
            bool res;
            assembly { res := sload(slot) }
            return abi.encode(res);
        }
        revert("redirectForToken: not supported");
    }

    function __setTokenInfo(string memory tokenType_, IHederaTokenService.TokenInfo memory tokenInfo, int32 decimals_) public virtual {
        tokenType = tokenType_;
        decimals = uint8(uint32(decimals_));

        // The assignment
        //
        // _tokenInfo = tokenInfo;
        //
        // cannot be used directly because it triggers the following compilation error
        //
        // Error (1834): Copying of type struct IHederaTokenService.TokenKey memory[] memory to storage is not supported in legacy (only supported by the IR pipeline).
        // Hint: try compiling with `--via-ir` (CLI) or the equivalent `viaIR: true` (Standard JSON)
        //
        // More specifically, the assigment
        //
        // _tokenInfo.token.tokenKeys = tokenInfo.token.tokenKeys;
        //
        // triggers the above error as well.
        //
        // Array assignments from memory to storage are not supported in legacy codegen https://github.com/ethereum/solidity/issues/3446#issuecomment-1924761902.
        // And using the `--via-ir` flag as mentioned above increases compilation time substantially
        // That is why we are better off copying the struct to storage manually.

        _tokenInfo.token.name = tokenInfo.token.name;
        _tokenInfo.token.symbol = tokenInfo.token.symbol;
        _tokenInfo.token.treasury = tokenInfo.token.treasury;
        _tokenInfo.token.memo = tokenInfo.token.memo;
        _tokenInfo.token.tokenSupplyType = tokenInfo.token.tokenSupplyType;
        _tokenInfo.token.maxSupply = tokenInfo.token.maxSupply;
        _tokenInfo.token.freezeDefault = tokenInfo.token.freezeDefault;

        for (uint256 i = 0; i < tokenInfo.token.tokenKeys.length; i++) {
            _tokenInfo.token.tokenKeys.push(tokenInfo.token.tokenKeys[i]);
        }

        _tokenInfo.token.expiry = tokenInfo.token.expiry;

        _tokenInfo.totalSupply = tokenInfo.totalSupply;
        _tokenInfo.deleted = tokenInfo.deleted;
        _tokenInfo.defaultKycStatus = tokenInfo.defaultKycStatus;
        _tokenInfo.pauseStatus = tokenInfo.pauseStatus;

        // The same copying issue as mentioned above for fee arrays.
        // _tokenInfo.fixedFees = tokenInfo.fixedFees;
        for (uint256 i = 0; i < tokenInfo.fixedFees.length; i++) {
            _tokenInfo.fixedFees.push(tokenInfo.fixedFees[i]);
        }
        // _tokenInfo.fractionalFees = tokenInfo.fractionalFees;
        for (uint256 i = 0; i < tokenInfo.fractionalFees.length; i++) {
            _tokenInfo.fractionalFees.push(tokenInfo.fractionalFees[i]);
        }
        // _tokenInfo.royaltyFees = tokenInfo.royaltyFees;
        for (uint256 i = 0; i < tokenInfo.royaltyFees.length; i++) {
            _tokenInfo.royaltyFees.push(tokenInfo.royaltyFees[i]);
        }

        _tokenInfo.ledgerId = tokenInfo.ledgerId;
    }

    function _initTokenData() internal virtual {
    }

    function _balanceOfSlot(address account) internal virtual returns (bytes32) {
        bytes4 selector = IERC20.balanceOf.selector;
        uint192 pad = 0x0;
        (uint32 accountId, ) = HtsSystemContract(HTS_ADDRESS).getAccountId(account);
        return bytes32(abi.encodePacked(selector, pad, accountId));
    }

    function _allowanceSlot(address owner, address spender) internal virtual returns (bytes32) {
        bytes4 selector = IERC20.allowance.selector;
        uint160 pad = 0x0;
        (uint32 ownerId, ) = HtsSystemContract(HTS_ADDRESS).getAccountId(owner);
        (uint32 spenderId, ) = HtsSystemContract(HTS_ADDRESS).getAccountId(spender);
        return bytes32(abi.encodePacked(selector, pad, spenderId, ownerId));
    }

    function _isAssociatedSlot(address account, bool revertIfNotExists) internal virtual returns (bytes32) {
        bytes4 selector = IHRC719.isAssociated.selector;
        uint192 pad = 0x0;
        (uint32 accountId, bool exists) = HtsSystemContract(HTS_ADDRESS).getAccountId(account);
        require(!revertIfNotExists || exists, "_isAssociatedSlot: account does not exist");
        return bytes32(abi.encodePacked(selector, pad, accountId));
    }

    function _tokenUriSlot(uint32 serialId) internal virtual returns (bytes32) {
        bytes4 selector = IERC721.tokenURI.selector;
        uint192 pad = 0x0;
        return bytes32(abi.encodePacked(selector, pad, serialId));
    }

    function _ownerOfSlot(uint32 serialId) internal virtual returns (bytes32) {
        bytes4 selector = IERC721.ownerOf.selector;
        uint192 pad = 0x0;
        return bytes32(abi.encodePacked(selector, pad, serialId));
    }

    function _getApprovedSlot(uint32 serialId) internal virtual returns (bytes32) {
        bytes4 selector = IERC721.getApproved.selector;
        uint192 pad = 0x0;
        return bytes32(abi.encodePacked(selector, pad, serialId));
    }

    function _isApprovedForAllSlot(address owner, address operator) internal virtual returns (bytes32) {
        bytes4 selector = IERC721.isApprovedForAll.selector;
        uint160 pad = 0x0;
        (uint32 ownerId, ) = HtsSystemContract(HTS_ADDRESS).getAccountId(owner);
        (uint32 operatorId, ) = HtsSystemContract(HTS_ADDRESS).getAccountId(operator);
        return bytes32(abi.encodePacked(selector, pad, ownerId, operatorId));
    }

    function __balanceOf(address account) private returns (uint256 amount) {
        bytes32 slot = _balanceOfSlot(account);
        assembly { amount := sload(slot) }
    }

    function __allowance(address owner, address spender) private returns (uint256 amount) {
        bytes32 slot = _allowanceSlot(owner, spender);
        assembly { amount := sload(slot) }
    }

    function __tokenURI(uint256 serialId) private returns (string memory uri) {
        bytes32 slot = _tokenUriSlot(uint32(serialId));
        string storage _uri;
        assembly { _uri.slot := slot }
        uri = _uri;
    }

    function __ownerOf(uint256 serialId) private returns (address owner) {
        bytes32 slot = _ownerOfSlot(uint32(serialId));
        assembly { owner := sload(slot) }
    }

    function __getApproved(uint256 serialId) private returns (address approved) {
        bytes32 slot = _getApprovedSlot(uint32(serialId));
        assembly { approved := sload(slot) }
    }

    function __isApprovedForAll(address owner, address operator) private returns (bool approvedForAll) {
        bytes32 slot = _isApprovedForAllSlot(owner, operator);
        assembly { approvedForAll := sload(slot) }
    }

    function _transfer(address from, address to, uint256 amount) private {
        require(from != address(0), "hts: invalid sender");
        require(to != address(0), "hts: invalid receiver");
        _update(from, to, amount);
        emit IERC20Events.Transfer(from, to, amount);
    }

    function _transferNFT(address sender, address from, address to, uint256 serialId) private {
        require(from != address(0), "hts: invalid sender");
        require(to != address(0), "hts: invalid receiver");

        // Check if the sender is the owner of the token
        bytes32 slot = _ownerOfSlot(uint32(serialId));
        address owner;
        assembly { owner := sload(slot) }
        require(owner == from, "hts: sender is not owner");
        if (sender != owner) {
            require(sender == __getApproved(serialId) || __isApprovedForAll(owner, sender), "hts: unauthorized");
        }

        // Clear approval
        bytes32 approvalSlot = _getApprovedSlot(uint32(serialId));
        assembly { sstore(approvalSlot, 0) }

        // Clear approval for all
        if (owner != sender) {
            bytes32 isApprovedForAllSlot = _isApprovedForAllSlot(owner, sender);
            assembly { sstore(isApprovedForAllSlot, false) }
        }

        // Set the new owner
        assembly { sstore(slot, to) }
        emit IERC721Events.Transfer(from, to, serialId);
    }

    function _update(address from, address to, uint256 amount) public {
        if (from == address(0)) {
            _tokenInfo.totalSupply += int64(int256(amount));
        } else {
            bytes32 fromSlot = _balanceOfSlot(from);
            uint256 fromBalance;
            assembly { fromBalance := sload(fromSlot) }
            require(fromBalance >= amount, "_transfer: insufficient balance");
            assembly { sstore(fromSlot, sub(fromBalance, amount)) }
        }

        if (to == address(0)) {
            _tokenInfo.totalSupply -= int64(int256(amount));
        } else {
            bytes32 toSlot = _balanceOfSlot(to);
            uint256 toBalance;
            assembly { toBalance := sload(toSlot) }
            // Solidity's checked arithmetic will revert if this overflows
            // https://soliditylang.org/blog/2020/12/16/solidity-v0.8.0-release-announcement
            uint256 newToBalance = toBalance + amount;
            assembly { sstore(toSlot, newToBalance) }
        }
    }

    function _approve(address owner, address spender, uint256 amount) private {
        require(owner != address(0), "_approve: invalid owner");
        require(spender != address(0), "_approve: invalid spender");
        bytes32 allowanceSlot = _allowanceSlot(owner, spender);
        assembly { sstore(allowanceSlot, amount) }
    }

    function _approve(address sender, address spender, uint256 serialId, bool isApproved) private {
        // The caller must own the token or be an approved operator.
        address owner = __ownerOf(serialId);
        require(
            sender == owner || __getApproved(serialId) == sender || __isApprovedForAll(owner, sender),
            "_approve: unauthorized"
        );

        bytes32 slot = _getApprovedSlot(uint32(serialId));
        address newApproved = isApproved ? spender : address(0);
        assembly { sstore(slot, newApproved) }
        emit IERC721Events.Approval(owner, spender, serialId);
    }

    /**
     * TODO: We might need to optimize the double owner+spender calls to get
     * their account IDs.
     */
    function _spendAllowance(address owner, address spender, uint256 amount) private {
        uint256 currentAllowance = __allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "_spendAllowance: insufficient");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    function _setApprovalForAll(address sender, address operator, bool approved) private {
        require(operator != address(0) && operator != sender, "setApprovalForAll: invalid operator");
        bytes32 slot = _isApprovedForAllSlot(sender, operator);
        assembly { sstore(slot, approved) }
        emit IERC721Events.ApprovalForAll(sender, operator, approved);
    }
}
