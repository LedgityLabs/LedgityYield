// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/**
 * @title LDY
 * @author Lila Rest (lila@ledgity.com)
 * @dev The $LDY is the utility and governance token of the entire Ledgity ecosystem.
 *
 * This contract has been kept as minimal as possible to enforce stakeholders safety
 * but also to pave the way for sensitive use cases like cross-chain bridging, use in
 * governance scenarios, and compatibility with 3rd party DApps.
 *
 * It is non-upgradeable, non-ownable, non-pausable, non-mintable, and non-restrictable.
 * It implements nothing more than what is provided by its OpenZepellin ancestors.
 *
 * Moreover, to eliminate the need for ownership and complex vesting functions, the
 * entire supply is minted at deployment-time. Vesting of allocated tokens is then
 * managed via Sablier streams that anyone can verify on this page:
 * https://docs.ledgity.finance/tokenomics/vesting-proofs
 *
 * Specifications:
 * - Name: Ledgity Token
 * - Symbol: LDY
 * - Decimals: 18
 * - Total supply: 75,000,000
 *
 * @custom:security-contact security@ledgity.com
 */
contract LDY is ERC20, ERC20Burnable {
    constructor() ERC20("Ledgity Token", "LDY") {
        _mint(msg.sender, 75_000_000 * 10 ** decimals());
    }
}
