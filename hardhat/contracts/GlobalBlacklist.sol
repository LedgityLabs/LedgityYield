// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {GlobalOwnableUpgradeable} from "./abstracts/GlobalOwnableUpgradeable.sol";

/**
 * @title GlobalBlacklist
 * @author Lila Rest (lila@ledgity.com)
 * @notice This contract is used to maintain a mapping of blacklisted accounts on chain.
 * It is then read by all contracts that inherit from GlobalRestrictableUpgradeable abstract
 * contract to restrict access to some functions to non-blacklisted accounts.
 * @dev For further details, see "GlobalBlacklist" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
contract GlobalBlacklist is Initializable, UUPSUpgradeable, GlobalOwnableUpgradeable {
    /**
     * @dev This mapping is made private and the getter function isBlacklisted() function is
     * used instead to read it. This helps saving gas in some scenario. See isBlacklisted()
     * documentation for more details.
     */
    mapping(address => bool) private _list;

    /**
     * @dev Prevents implementation contract from being initialized as recommended by
     * OpenZeppelin.
     * See: https://docs.openzeppelin.com/contracts/4.x/api/proxy#Initializable-_disableInitializers--
     * @custom:oz-upgrades-unsafe-allow constructor
     */
    constructor() {
        _disableInitializers();
    }

    /**
     * @dev Replaces the constructor() function in context of an upgradeable contract.
     * See: https://docs.openzeppelin.com/contracts/4.x/upgradeable
     * @param globalOwner_ The address of the GlobalOwner contract
     */
    function initialize(address globalOwner_) public initializer {
        __GlobalOwnable_init(globalOwner_);
        __UUPSUpgradeable_init();
    }

    /**
     * @dev Override of UUPSUpgradeable._authorizeUpgrade() function restricted to the global
     * owner. Note that this function is called by the proxy contract while upgrading.
     * @param newImplementation The address of the new implementation contract
     */
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    /**
     * @dev Sets a given account as blacklisted.
     * @param account The account's address to blacklist
     */
    function blacklist(address account) external onlyOwner {
        require(account != address(0), "GlobalBlacklist: cannot blacklist zero address");
        _list[account] = true;
    }

    /**
     * @dev Removes a given account from blacklist.
     * @param account The account's address to unblacklist
     */
    function unBlacklist(address account) external onlyOwner {
        _list[account] = false;
    }

    /**
     * @dev Checks if given account is blacklisted.
     * @param account The account to check
     * @return 'true' if the account is blacklisted, 'false' otherwise
     */
    function isBlacklisted(address account) external view returns (bool) {
        // Avoir reading chain storage if account is the zero address (e.g, during a mint or a burn)
        if (account == address(0)) return false;
        // Else return current blacklist status of the account
        return _list[account];
    }
}
