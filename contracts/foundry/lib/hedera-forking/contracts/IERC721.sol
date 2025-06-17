// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

/**
 * @dev Required interface of an ERC-721 compliant contract.
 *
 * https://hips.hedera.com/hip/hip-218
 * https://hips.hedera.com/hip/hip-376
 */
interface IERC721 {
    /**
     * @dev Emitted when ownership of any NFT changes by any mechanism.
     * This event emits when NFTs are created (`from` == 0) and destroyed (`to` == 0).
     * Otherwise, it indicates that the token with ID {tokenId} was transferred from {from} to {to},
     * where {from} represents the previous owner of the token, not the approved spender.
     *
     * Exception: during contract creation, any number of NFTs may be created and assigned without emitting Transfer.
     *
     * At the time of any transfer, the approved address for that NFT (if any) is reset to none.
     *
     * This event should be emitted by `transfer` and `transferFrom` methods.
     *
     * See https://ethereum.org/en/developers/docs/standards/tokens/erc-721/#events for more information.
     */
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

    /**
     * @dev Emitted when the approved address for an NFT is changed or reaffirmed from {from} to {to} address.
     * The zero {to} address indicates there will be no approved address.
     * Additionally the approved address for that NFT (if any) is reset to none.
     *
     * This event should be emitted by the `approve` method.
     *
     * See https://ethereum.org/en/developers/docs/standards/tokens/erc-721/#events for more information.
     */
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);

    /**
     * @dev Emitted when an operator {operator} is enabled or disabled {approved}
     * for an owner {owner}. The operator {operator} can than manage all NFTs of the owner {owner}.
     *
     * This event should be emitted by the `setApprovalForAll` method.
     *
     * See https://ethereum.org/en/developers/docs/standards/tokens/erc-721/#events for more information.
     */
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    /**
     * @dev Returns the token collection name.
     */
    function name() external view returns (string memory);

    /**
     * @dev Returns the token collection symbol.
     */
    function symbol() external view returns (string memory);

    /**
     * @dev Returns the Uniform Resource Identifier (URI) for `serialId` token.
     */
    function tokenURI(uint256 serialId) external view returns (string memory);

    /**
     * @dev Returns the total amount of tokens stored by the contract.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the number of tokens in `owner`'s account.
     */
    function balanceOf(address owner) external view returns (uint256 balance);

    /**
     * @dev Returns the owner of the `serialId` token.
     *
     * Requirements:
     * - `serialId` must exist.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function ownerOf(uint256 serialId) external view returns (address);

    /**
     * @dev Transfers `serialId` token from `sender` to `recipient`.
     *
     * Requirements:
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `serialId` token must be owned by `sender`.
     * - If the caller is not `sender`, it must be approved to move this token by either {approve} or {setApprovalForAll}.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address sender, address recipient, uint256 serialId) external payable;

    /**
     * @dev Gives permission to `spender` to transfer `serialId` token to another account.
     * The approval is cleared when the token is transferred.
     *
     * Only a single account can be approved at a time, so approving the zero address clears previous approvals.
     *
     * Requirements:
     * - The caller must own the token or be an approved operator.
     * - `serialId` must exist.
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 serialId) external payable;

    /**
     * @dev Approve or remove `operator` as an operator for the caller.
     * Operators can call {transferFrom} or {safeTransferFrom} for any token owned by the caller.
     *
     * Requirements:
     * - The `operator` cannot be the address zero.
     *
     * Emits an {ApprovalForAll} event.
     */
    function setApprovalForAll(address operator, bool approved) external;

    /**
     * @dev Returns the account approved for `serialId` token.
     *
     * Requirements:
     * - `serialId` must exist.
     */
    function getApproved(uint256 serialId) external view returns (address operator);

    /**
     * @dev Returns if the `operator` is allowed to manage all of the assets of `owner`.
     *
     * See {setApprovalForAll}
     */
    function isApprovedForAll(address owner, address operator) external view returns (bool);
}
