// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

/**
 * @title SonicFeeMRegister
 * @notice Register a contract on Sonic FeeM
 * @custom:doc https://docs.soniclabs.com/funding/fee-monetization
 */
contract SonicFeeMRegister {
  function registerContract() public {
    (bool _success, ) = address(
      0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830
    ).call(abi.encodeWithSignature("selfRegister(uint256)", 149));
    require(_success, "FeeM registration failed");
  }
}
