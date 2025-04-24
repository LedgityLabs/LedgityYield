// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import { IERC20MetadataUpgradeable } from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";
import { ITransfersListener } from "./ITransfersListener.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title ILToken
 * @notice Interface for the LToken contract, which powers the Ledgity Yield protocol's L-Tokens
 */
interface ILToken is IERC20MetadataUpgradeable {
  /// @dev Represents type of actions triggering ActivityEvent events
  enum Action {
    Deposit,
    Withdraw
  }

  /// @dev Represents different status of actions triggering ActivityEvent events
  enum Status {
    Pending,
    Success,
    Failed,
    Cancelled
  }

  /// @dev Structure representing a withdrawal request
  struct WithdrawalRequest {
    address account;
    uint96 amount;
    uint40 timestamp;
    bool isBig;
  }

  // Custom Errors
  error OnlyWithdrawer();
  error OnlyFund();
  error ExceedsRetentionRate();
  error ListenerNotFound();
  error CantRecoverUnderlying();
  error NothingToRecover();
  error NotImplemented();
  error UseDeposit();
  error InsufficientBalance();
  error InsufficientLTokens();
  error InsufficientLiquidity();
  error RequestorBlacklisted();
  error NotBigRequest();
  error InsufficientCoverage();
  error AmountTooLarge();
  error AmountExceedsUint96();
  error IncorrectETHValue();
  error ETHTransferFailed();
  error NotRequestOwner();
  error InsufficientFundBalance();
  error ExceedsRetention();
  error NoFeesToClaim();
  error InsufficientForFees();
  error WithdrawerZeroAddress();
  error FundZeroAddress();
  error InvalidRequestId();
  error ExceedsMaxFeesRate();
  error OnlyHighTierAllowed();

  // Events
  event TVLChangeEvent(uint256 newTVL);
  event ActivityEvent(
    int256 indexed id,
    address indexed account,
    Action indexed action,
    uint256 amount,
    uint256 processedAmount,
    Status status,
    int256 relatedId,
    string data
  );
  event MintedRewardsEvent(
    address indexed account,
    uint256 balanceBefore,
    uint256 rewards
  );

  /**
   * @notice Returns the underlying token contract
   */
  function underlying() external view returns (IERC20);

  /**
   * @notice Returns the address of the withdrawer wallet
   */
  function withdrawer() external view returns (address payable);

  /**
   * @notice Returns the address of the fund wallet
   */
  function fund() external view returns (address payable);

  /**
   * @notice Returns the withdrawal fees rate in UD7x3 format
   */
  function feesRateUD7x3() external view returns (uint32);

  /**
   * @notice Returns the retention rate in UD7x3 format
   */
  function retentionRateUD7x3() external view returns (uint32);

  /**
   * @notice Returns the amount of unclaimed fees
   */
  function unclaimedFees() external view returns (uint256);

  /**
   * @notice Returns the withdrawal fee in ETH
   */
  function withdrawalFeeInEth() external view returns (uint256);

  /**
   * @notice Returns whether only high tier accounts may use instant withdrawals
   */
  function onlyHighTierInstantWithdrawal()
    external
    view
    returns (bool);

  /**
   * @notice Returns the current APR in UD7x3 format
   * @return The current APR in UD7x3 format
   */
  function getAPR() external view returns (uint16);

  /**
   * @notice Returns a withdrawal request by its ID
   */
  function withdrawalQueue(
    uint256
  ) external view returns (WithdrawalRequest memory);

  /**
   * @notice Sets the fees rate
   * @param feesRateUD7x3_ The new fees rate in UD7x3 format
   */
  function setFeesRate(uint32 feesRateUD7x3_) external;

  /**
   * @notice Sets the withdrawal fee in ETH
   * @param withdrawalFeeInEth_ The new withdrawal fee in ETH
   */
  function setWithdrawalFeeInEth(
    uint256 withdrawalFeeInEth_
  ) external;

  /**
   * @notice Sets the withdrawer wallet address
   * @param withdrawer_ The new withdrawer wallet address
   */
  function setWithdrawer(address withdrawer_) external;

  /**
   * @notice Sets the fund wallet address
   * @param fund_ The new fund wallet address
   */
  function setFund(address fund_) external;

  /**
   * @notice Adds a transfers listener
   * @param listenerContract The address of the new transfers listener contract
   */
  function listenToTransfers(address listenerContract) external;

  /**
   * @notice Removes a transfers listener
   * @param listenerContract The address of the transfers listener contract to remove
   */
  function unlistenToTransfers(address listenerContract) external;

  /**
   * @notice Deposits underlying tokens to receive L-Tokens
   * @param amount The amount of underlying tokens to deposit
   * @param refCode The Referral code
   */
  function deposit(uint256 amount, string memory refCode) external;

  /**
   * @notice Withdraws L-Tokens to receive underlying tokens
   * @param amount The amount of L-Tokens to withdraw
   */
  function withdraw(uint256 amount) external payable;

  /**
   * @notice Requests a withdrawal of L-Tokens
   * @param amount The amount of L-Tokens to withdraw
   */
  function requestWithdrawal(uint256 amount) external payable;

  /**
   * @notice Cancels a withdrawal request
   * @param requestId The ID of the withdrawal request to cancel
   */
  function cancelWithdrawalRequest(uint256 requestId) external;

  /**
   * @notice Repatriates underlying tokens to the contract
   * @param amount The amount of underlying tokens to repatriate
   */
  function repatriate(uint256 amount) external;

  /**
   * @notice Claims accumulated fees
   */
  function claimFees() external;

  /**
   * @notice Enables/disables high tier only instant withdrawals
   */
  function switchOnlyHighTierInstantWithdrawal(bool status_) external;
}
