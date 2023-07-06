// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "hardhat/console.sol";

/**
 * @title UDS3
 * @author Lila Rest (lila@ledgity.com)
 * @notice This library provides utilities to create and interact with APR checkpoints,
 * which are basically a way to efficiently store on chain an history of APRs .
 * @dev For more details see "APRCheckpoints" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
library APRCheckpoints {
    /**
     * @dev High-level representation of an APR checkpoint. It doesn't represent how
     * checkpoints are stored on-chain (see "Pack" instead).
     * @param aprUD3 The APR in UD3 format (3 digits fixed point number, e.g., 12.345% = 12345)
     * @param timestamp The timestamp of the checkpoint
     */
    struct Checkpoint {
        uint16 aprUD3; // Allows up to 65.536% APR (3 digits of precision)
        uint40 timestamp; // Allows datetime up to 20/02/36812
    }

    /**
     * @dev Represents gas-efficient checkpoints storage on-chain. Each pack can hold up to 4
     * checkpoints. See "APRCheckpoints library" section of whitepaper for more details.
     * @param aprsUD3 Array of checkpoint's APRs
     * @param timestamps Array of checkpoint's timestamps
     * @param cursor Index of the next checkpoint to be written
     */
    struct Pack {
        uint16[4] aprsUD3;
        uint40[4] timestamps;
        uint32 cursor;
    }

    /**
     * @dev Represents a reference to an APR checkpoint. A reference allows to identify the APR
     * checkpoint in an array of packs.
     * @param packIndex Index of the pack the checkpoint belongs to (in the array of packs).
     * @param cursorIndex Index of the checkpoint in this pack (between 0 and 3)
     */
    struct Reference {
        uint64 packIndex;
        uint8 cursorIndex;
    }

    /**
     * @dev Returns the reference of the checkpoint that follows the checkpoint represented
     * by the given reference.
     * @param ref The reference to be incremented
     * @return The incremented reference
     */
    function incrementReference(Reference memory ref) internal pure returns (Reference memory) {
        // If this is the last checkpoint slot of the pack
        if (ref.cursorIndex == 3) {
            // Increment the pack index and reset the cursor index
            ref.packIndex++;
            ref.cursorIndex = 0;
        }
        // Else increment the cursor index
        else ref.cursorIndex++;
        return ref;
    }

    /**
     * @dev Extacts a checkpoint data from its reference in an array of packs.
     * @param packs The array of packs to extract the checkpoint from
     * @param ref The reference to the checkpoint to extract
     * @return checkpoint The extracted checkpoint data
     */
    function getFromReference(
        Pack[] storage packs,
        Reference memory ref
    ) internal view returns (Checkpoint memory checkpoint) {
        // If the checkpoint's pack exists
        if (packs.length > ref.packIndex) {
            // Extract its data
            Pack memory pack = packs[ref.packIndex];

            // Build and return the checkpoint data
            // Note that there is no need to check if the cursor index has been written
            // as they are all initialized to 0 in _newBlankPack() function, so will
            // by default return 0 if not written
            return
                Checkpoint({
                    aprUD3: pack.aprsUD3[ref.cursorIndex],
                    timestamp: pack.timestamps[ref.cursorIndex]
                });
        }
        // Else retruns  empty Checkpoint if the reference is out of bounds
        return Checkpoint(0, 0);
    }

    /**
     * @dev Compute and return the reference of the latest checkpoint written in the given array of packs.
     * @param packs The array of packs to compute the reference from
     * @return The reference of the latest checkpoint
     */
    function getLatestReference(Pack[] storage packs) internal view returns (Reference memory) {
        uint256 packLength = packs.length;
        return
            Reference({
                packIndex: uint64(packLength - 1),
                cursorIndex: uint8(packs[packLength - 1].cursor - 1)
            });
    }

    /**
     * @dev Appends a new empty pack to the given array of packs.
     * @param packs The array of packs to append the new pack to
     */
    function _newBlankPack(Pack[] storage packs) private {
        packs.push(
            APRCheckpoints.Pack({
                aprsUD3: [uint16(0), uint16(0), uint16(0), uint16(0)],
                timestamps: [uint40(0), uint40(0), uint40(0), uint40(0)],
                cursor: 0
            })
        );
    }

    /**
     * This function allows updating the current APR. Under the hood it writes a new APR checkpoint.
     * For more details, see "APRCheckpoints library" section of whitepaper.
     * @param packs The array of packs to append the checkpoint to
     * @param aprUD3 The new APR in UD3 format
     */
    function setAPR(Pack[] storage packs, uint16 aprUD3) internal {
        uint256 packLength = packs.length;

        Reference memory ref;

        // Retrieve the reference of the checkpoint to be written, and create its pack if it doesn't exist yet
        if (packLength == 0) {
            ref = Reference(0, 0);
            _newBlankPack(packs);
        } else {
            ref = incrementReference(getLatestReference(packs));
            if (packs.length - 1 != ref.packIndex) _newBlankPack(packs);
        }

        // Retrieve the pack to write the checkpoint in
        Pack memory pack = packs[ref.packIndex];

        // Write the new checkpoint in the pack
        console.log("ref.cursorIndex", ref.cursorIndex);
        pack.aprsUD3[ref.cursorIndex] = aprUD3;
        pack.timestamps[ref.cursorIndex] = uint40(block.timestamp);

        // Increment the pack's cursor
        pack.cursor++;

        // Store the updated pack
        packs[packs.length - 1] = pack;
    }

    function getAPR(Pack[] storage packs) internal view returns (uint16) {
        Reference memory ref = getLatestReference(packs);
        Checkpoint memory data = getFromReference(packs, ref);
        return data.aprUD3;
    }
}
