// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import { ILToken } from "../interfaces/ILToken.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Minimal stub for test compilation
interface ITransfersListener {

}

contract MockLToken is ILToken {
  uint256 public _totalSupply;
  mapping(address => uint256) public _balances;
  mapping(address => mapping(address => uint256)) public _allowances;
  uint16 public apr;
  address public _underlying;

  constructor(address underlying_) {
    _underlying = underlying_;
  }

  function setAPR(uint16 _apr) external {
    apr = _apr;
  }

  function getAPR() external view override returns (uint16) {
    return apr;
  }

  function mint(address to, uint256 amount) external {
    _balances[to] += amount;
    _totalSupply += amount;
  }

  function deposit(uint256 amount) external override {
    // For test, just mint LTokens to sender
    _balances[msg.sender] += amount;
    _totalSupply += amount;
  }

  function balanceOf(
    address account
  ) external view override returns (uint256) {
    return _balances[account];
  }

  function transferFrom(
    address from,
    address to,
    uint256 amount
  ) external override returns (bool) {
    require(_balances[from] >= amount, "Insufficient balance");
    if (msg.sender != from) {
      require(
        _allowances[from][msg.sender] >= amount,
        "Insufficient allowance"
      );
      _allowances[from][msg.sender] -= amount;
    }
    _balances[from] -= amount;
    _balances[to] += amount;
    return true;
  }

  function transfer(
    address to,
    uint256 amount
  ) external override returns (bool) {
    require(_balances[msg.sender] >= amount, "Insufficient balance");
    _balances[msg.sender] -= amount;
    _balances[to] += amount;
    return true;
  }

  function approve(
    address spender,
    uint256 amount
  ) external override returns (bool) {
    _allowances[msg.sender][spender] = amount;
    return true;
  }

  function allowance(
    address owner,
    address spender
  ) external view override returns (uint256) {
    return _allowances[owner][spender];
  }

  function totalSupply() external view override returns (uint256) {
    return _totalSupply;
  }

  function name() external pure override returns (string memory) {
    return "Mock LToken";
  }

  function symbol() external pure override returns (string memory) {
    return "MLT";
  }

  function decimals() external pure override returns (uint8) {
    return 18;
  }

  function underlying() external view override returns (IERC20) {
    return IERC20(_underlying);
  }

  // Stubs for unneeded functions
  function withdraw(uint256) external payable override {}

  function requestWithdrawal(uint256) external payable override {}

  function cancelWithdrawalRequest(uint256) external override {}

  function repatriate(uint256) external override {}

  function claimFees() external override {}

  function listenToTransfers(address) external override {}

  function unlistenToTransfers(address) external override {}

  function setFeesRate(uint32) external override {}

  function setWithdrawalFeeInEth(uint256) external override {}

  function setWithdrawer(address) external override {}

  function setFund(address) external override {}

  function withdrawalQueue(
    uint256
  ) external view override returns (WithdrawalRequest memory) {
    revert();
  }

  function withdrawer()
    external
    view
    override
    returns (address payable)
  {
    revert();
  }

  function fund() external view override returns (address payable) {
    revert();
  }

  function feesRateUD7x3() external view override returns (uint32) {
    return 0;
  }

  function retentionRateUD7x3()
    external
    view
    override
    returns (uint32)
  {
    return 0;
  }

  function unclaimedFees() external view override returns (uint256) {
    return 0;
  }

  function withdrawalFeeInEth()
    external
    view
    override
    returns (uint256)
  {
    return 0;
  }

  function onlyHighTierInstantWithdrawal()
    external
    view
    override
    returns (bool)
  {
    return false;
  }

  function switchOnlyHighTierInstantWithdrawal(
    bool
  ) external override {}
}
