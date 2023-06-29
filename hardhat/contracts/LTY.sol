// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";

import "./abstracts/RestrictedUpgradeable.sol";
import "./abstracts/RecoverUpgradeable.sol";

/**
 * @dev
 */
contract LTY is
    Initializable,
    ERC20Upgradeable,
    ERC20PausableUpgradeable,
    ERC20BurnableUpgradeable,
    ERC20CappedUpgradeable,
    Ownable2StepUpgradeable,
    UUPSUpgradeable,
    RestrictedUpgradeable,
    RecoverUpgradeable
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        // __Pausable_init();
        __ERC20_init("Ledgity Token", "LTY");
        __ERC20Pausable_init();
        __ERC20Burnable_init();
        __ERC20Capped_init(100_000_000 * 10 ** 18);
        __Ownable2Step_init();
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Implements a bunch of parent contract functions reserved to owner
     * See UUPSUpgradeable and PausableUpgradeable for more details about those.
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    /**
     * @dev Override of ERC20._beforeTokenTransfer() hook that ensures transfer
     * emitter and receiver are not blacklisted and that the token contract
     * is not paused.
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    )
        internal
        override(ERC20Upgradeable, ERC20PausableUpgradeable)
        whenNotPaused
        notBlacklisted(from)
        notBlacklisted(to)
    {
        ERC20Upgradeable._beforeTokenTransfer(from, to, amount);
    }

    /** @dev Required override of ERC20._mint() because of conflict between ERC20 and Capped extension */
    function _mint(
        address account,
        uint256 amount
    ) internal virtual override(ERC20Upgradeable, ERC20CappedUpgradeable) {
        ERC20Upgradeable._mint(account, amount);
    }

    function setBlacklist(address _contract) external onlyOwner {
        _setBlacklist(_contract);
    }

    function mint(uint256 amount) public onlyOwner {
        _mint(msg.sender, amount);
    }
}
