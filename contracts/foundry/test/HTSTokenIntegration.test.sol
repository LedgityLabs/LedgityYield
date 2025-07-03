// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "forge-std/Test.sol";
import { Hsc } from "../../foundry/lib/hedera-forking/contracts/Hsc.sol";

// Contracts
import { WrappedLTokenHedera } from "../../src/hedera/WrappedLTokenHedera.sol";
import { LTokenHedera } from "../../src/hedera/LTokenHedera.sol";
import { GlobalOwner } from "../../src/GlobalOwner.sol";
import { GlobalPause } from "../../src/GlobalPause.sol";
import { GlobalBlacklist } from "../../src/GlobalBlacklist.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";
import { LDYStaking } from "../../src/LDYStaking.sol";
import { GenericERC20 } from "../../src/GenericERC20.sol";
// Hedera imports
import { IHederaTokenService } from "../../src/hedera/lib/IHederaTokenService.sol";
import { IERC20Metadata } from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";

import { console2 as console } from "forge-std/console2.sol";

/**
 * @title HTSTokenInterface
 * @dev Interface for interacting with HTS tokens
 */
interface HTSTokenInterface is IERC20Metadata, IHederaTokenService {

}

/**
 * @title HTSTokenIntegrationTest
 * @dev Test file for verifying integration with real HTS tokens
 */
contract HTSTokenIntegration is Test {
  // ======== Storage ======== //
  WrappedLTokenHedera wLToken;
  LTokenHedera lToken;
  HTSTokenInterface htsToken;
  GlobalOwner globalOwner;
  GlobalPause globalPause;
  GlobalBlacklist globalBlacklist;
  LDYStaking ldyStaking;
  GenericERC20 ldyToken;

  uint256 public constant OneMonth = 31 * 24 * 60 * 60;
  LDYStaking.StakeDurationInfo[] public stakingDurationInfos;
  uint256[] durations = [0, 1, 6, 12, 24, 36];

  // Test users
  address alice = address(0xA11CE);
  address bob = address(0xB0B);
  address carol = address(0xCA401);

  // Constants for testing
  uint256 constant INITIAL_BALANCE = 1_000_000 ether;
  uint256 constant APR_1 = 1000; // 1% APR in UD7x3 format
  uint256 constant APR_20 = 20000; // 20% APR

  // Events for testing
  event Deposit(
    address indexed caller,
    address indexed owner,
    uint256 assets,
    uint256 shares
  );
  event Withdraw(
    address indexed caller,
    address indexed receiver,
    address indexed owner,
    uint256 assets,
    uint256 shares
  );

  function setUp() public {
    // Fork Hedera mainnet
    vm.createSelectFork("https://hedera.linkpool.pro");

    for (uint256 i = 0; i < durations.length; i++) {
      stakingDurationInfos.push(
        LDYStaking.StakeDurationInfo(durations[i] * OneMonth, 10000)
      );
    }

    // Setup Hedera Token Service
    Hsc.htsSetup();

    htsToken = HTSTokenInterface(
      0x000000000000000000000000000000000006f89a
    ); // USDC on Hedera
    ldyToken = new GenericERC20("Ledgity Token", "LDY", 18);

    GlobalOwner globalOwnerImpl = new GlobalOwner();
    GlobalPause globalPauseImpl = new GlobalPause();
    GlobalBlacklist globalBlacklistImpl = new GlobalBlacklist();
    LDYStaking ldyStakingImpl = new LDYStaking();
    LTokenHedera lTokenImpl = new LTokenHedera();
    WrappedLTokenHedera wrappedLTokenImpl = new WrappedLTokenHedera();

    // Deploy proxies
    ERC1967Proxy globalOwnerProxy = new ERC1967Proxy(
      address(globalOwnerImpl),
      ""
    );
    ERC1967Proxy globalPauseProxy = new ERC1967Proxy(
      address(globalPauseImpl),
      ""
    );
    ERC1967Proxy globalBlacklistProxy = new ERC1967Proxy(
      address(globalBlacklistImpl),
      ""
    );
    ERC1967Proxy ldyStakingProxy = new ERC1967Proxy(
      address(ldyStakingImpl),
      ""
    );
    ERC1967Proxy lTokenProxy = new ERC1967Proxy(
      address(lTokenImpl),
      ""
    );
    ERC1967Proxy wrappedLTokenProxy = new ERC1967Proxy(
      address(wrappedLTokenImpl),
      ""
    );

    globalOwner = GlobalOwner(address(globalOwnerProxy));
    globalPause = GlobalPause(address(globalPauseProxy));
    globalBlacklist = GlobalBlacklist(address(globalBlacklistProxy));
    ldyStaking = LDYStaking(address(ldyStakingProxy));
    lToken = LTokenHedera(address(lTokenProxy));
    wLToken = WrappedLTokenHedera(address(wrappedLTokenProxy));

    globalOwner.initialize();
    globalPause.initialize(address(globalOwner));
    globalBlacklist.initialize(address(globalOwner));
    ldyStaking.initialize(
      address(globalOwner),
      address(globalPause),
      address(globalBlacklist),
      address(ldyToken),
      stakingDurationInfos,
      12 * OneMonth,
      1000 * 1e18
    );
    lToken.initialize(
      address(globalOwner),
      address(globalPause),
      address(globalBlacklist),
      address(ldyStaking),
      address(htsToken),
      true,
      "LToken HTS",
      "LHTS"
    );
    wLToken.initialize(
      address(globalOwner),
      address(globalPause),
      address(globalBlacklist),
      address(lToken),
      "Wrapped LToken HTS",
      "wLHTS"
    );

    // Setup labels
    vm.label(address(htsToken), "HTS Token");
    vm.label(address(ldyToken), "LDY token");
    vm.label(address(globalOwner), "GlobalOwner");
    vm.label(address(globalPause), "GlobalPause");
    vm.label(address(globalBlacklist), "GlobalBlacklist");
    vm.label(address(ldyStaking), "LDYStaking");
    vm.label(address(lToken), "LToken");
    vm.label(address(wLToken), "WrappedLToken");
    vm.label(alice, "Alice");
    vm.label(bob, "Bob");
    vm.label(carol, "Carol");

    // Get token decimals from the actual token
    uint8 tokenDecimals = htsToken.decimals();
    // Deal HTS tokens to test addresses
    // Since we're using a real token, we need to use vm.deal or similar methods
    // to give our test addresses some tokens
    deal(
      address(htsToken),
      address(this),
      INITIAL_BALANCE / 10 ** (18 - tokenDecimals)
    );
    deal(
      address(htsToken),
      alice,
      INITIAL_BALANCE / 10 ** (18 - tokenDecimals)
    );
    deal(
      address(htsToken),
      bob,
      INITIAL_BALANCE / 10 ** (18 - tokenDecimals)
    );
    deal(
      address(htsToken),
      carol,
      INITIAL_BALANCE / 10 ** (18 - tokenDecimals)
    );

    // Set initial supply for LToken
    deal(
      address(htsToken),
      address(lToken),
      (INITIAL_BALANCE * 3) / 10 ** (18 - tokenDecimals)
    );
    // Send 1 LToken to wLToken in order to compensate for the autocompounding diff
    // Using the deposit function since we can't directly mint LTokens
    htsToken.approve(address(lToken), type(uint256).max);
    // Adjust for token decimals
    lToken.deposit(10 ** tokenDecimals, "");

    // Approvals
    htsToken.approve(address(lToken), type(uint256).max);
    htsToken.approve(address(wLToken), type(uint256).max);
    lToken.approve(address(wLToken), type(uint256).max);

    vm.startPrank(alice);
    htsToken.approve(address(lToken), type(uint256).max);
    htsToken.approve(address(wLToken), type(uint256).max);
    lToken.approve(address(wLToken), type(uint256).max);
    vm.stopPrank();

    vm.startPrank(bob);
    htsToken.approve(address(lToken), type(uint256).max);
    htsToken.approve(address(wLToken), type(uint256).max);
    lToken.approve(address(wLToken), type(uint256).max);
    vm.stopPrank();

    vm.startPrank(carol);
    htsToken.approve(address(lToken), type(uint256).max);
    htsToken.approve(address(wLToken), type(uint256).max);
    lToken.approve(address(wLToken), type(uint256).max);
    vm.stopPrank();
  }

  function testDepositWithHTSToken() public {
    vm.startPrank(bob);

    // Get token decimals from the actual token
    uint8 tokenDecimals = htsToken.decimals();
    uint256 depositAmount = 100 * 10 ** tokenDecimals; // 100 HTS tokens
    uint256 initialBalance = htsToken.balanceOf(bob);
    uint256 initialBalanceDeployer = htsToken.balanceOf(
      address(this)
    );

    // Deposit HTS tokens into LToken
    lToken.deposit(depositAmount, "");

    // Verify deposit was successful
    assertEq(htsToken.balanceOf(bob), initialBalance - depositAmount);
    assertEq(
      htsToken.balanceOf(address(this)),
      initialBalanceDeployer + ((depositAmount / 10) * 9)
    );

    vm.stopPrank();
  }

  function testDepositAndWrapWithHTSToken() public {
    vm.startPrank(bob);

    // Get token decimals from the actual token
    uint8 tokenDecimals = htsToken.decimals();
    uint256 depositAmount = 100 * 10 ** tokenDecimals; // 100 HTS tokens
    uint256 initialBalance = htsToken.balanceOf(bob);

    // Deposit and wrap HTS tokens
    wLToken.depositAndWrap(depositAmount);

    // Verify deposit and wrap was successful
    assertEq(htsToken.balanceOf(bob), initialBalance - depositAmount);

    vm.stopPrank();
  }
}
