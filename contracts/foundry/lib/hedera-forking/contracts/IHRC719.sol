// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.4.9 <0.9.0;

/**
 * https://hips.hedera.com/hip/hip-719
 */
interface IHRC719 {
    /// @notice Associates the calling account with the token
    /// @dev This function allows an account to opt-in to receive the token
    /// @return responseCode The response code indicating the result of the operation
    function associate() external returns (uint256 responseCode);

    /// @notice Dissociates the calling account from the token
    /// @dev This function allows an account to opt-out from receiving the token
    /// @return responseCode The response code indicating the result of the operation
    function dissociate() external returns (uint256 responseCode);

    /// @notice Checks if the calling account is associated with the token
    /// @dev This function returns the association status of the calling account
    /// @return associated True if the account is associated, false otherwise
    function isAssociated() external view returns (bool associated);
}
