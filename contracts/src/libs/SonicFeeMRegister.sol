// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

library SonicFeeMRegister {
  /// @dev Register my contract on Sonic FeeM
  function registerContract() public {
    (bool _success, ) = address(
      0xDC2B0D2Dd2b7759D97D50db4eabDC36973110830
    ).call(abi.encodeWithSignature("selfRegister(uint256)", 149));
    require(_success, "FeeM registration failed");
  }
}
