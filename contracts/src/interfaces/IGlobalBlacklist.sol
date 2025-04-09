// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/**
 * @title IGlobalBlacklist
 * @notice Interface for the GlobalBlacklist contract that manages blacklisted accounts
 * across the Ledgity Yield codebase
 */
interface IGlobalBlacklist {
    /// @dev Emitted when `account` is blacklisted
    event Blacklisted(address account);

    /// @dev Emitted when `account` is unblacklisted
    event Unblacklisted(address account);

    /**
     * @notice Adds a given account to the blacklist
     * @param account The account's address to be blacklisted
     */
    function blacklist(address account) external;

    /**
     * @notice Removes a given account from the blacklist
     * @param account The account's address to be un-blacklisted
     */
    function unBlacklist(address account) external;

    /**
     * @notice Checks whether a given account is blacklisted
     * @param account Address of the account to check
     * @return 'true' if the account is blacklisted, 'false' otherwise
     */
    function isBlacklisted(address account) external view returns (bool);
}
