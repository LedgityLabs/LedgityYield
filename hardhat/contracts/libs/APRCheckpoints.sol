// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title UDS3
 * @author Lila Rest (lila@ledgity.com)
 * @notice This library provides utilities to create and interact with APR checkpoints.
 * Which are basically a way to efficiently store history of APRs on chain.
 * See "APRCheckpoints library" section of whitepaper for more details.
 */
library APRCheckpoints {
    /**
     * @dev High-level representation of an APR checkpoint. It doesn't represent how
     * checkpoints are stored on-chain (see "Pack" instead).
     * @param aprUD3 The APR in UD3 format (3 digit fixed point number, e.g., 12.345% = 12345)
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
    function incrementCheckpointReference(
        Reference memory ref
    ) internal pure returns (Reference memory) {
        // If this is the last checkpoint slot of the pack
        if (ref.cursorIndex == 4) {
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
    function getCheckpointFromReference(
        Pack[] storage packs,
        Reference memory ref
    ) internal view returns (Checkpoint memory checkpoint) {
        // Extract pack containing the checkpoint
        Pack memory pack = packs[ref.packIndex];

        // Build and return the checkpoint data
        return
            Checkpoint({
                aprUD3: pack.aprsUD3[ref.cursorIndex],
                timestamp: pack.timestamps[ref.cursorIndex]
            });
    }

    /**
     * @dev Compute and return the reference of the latest checkpoint written in the given array of packs.
     * @param packs The array of packs to compute the reference from
     * @return The reference of the latest checkpoint
     */
    function getLatestCheckpointReference(
        Pack[] storage packs
    ) internal view returns (Reference memory) {
        uint256 packLength = packs.length;
        uint64 latestPackIndex = uint64(packLength > 0 ? packs.length - 1 : 0);
        uint8 latestWrittenCursor = uint8(packs[latestPackIndex].cursor - 1);
        return Reference({packIndex: latestPackIndex, cursorIndex: latestWrittenCursor});
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
        // Retrieve the reference of the checkpoint to be written and the pack it belongs to
        Reference memory ref = incrementCheckpointReference(getLatestCheckpointReference(packs));

        // If the pack doesn't exist yet, create it
        if (packs.length - 1 != ref.packIndex) _newBlankPack(packs);

        // Retrieve the pack to write the checkpoint in
        Pack memory pack = packs[ref.packIndex];

        // Write the new checkpoint in the pack
        pack.aprsUD3[ref.cursorIndex] = aprUD3;
        pack.timestamps[ref.cursorIndex] = uint40(block.timestamp);

        // Increment the pack's cursor
        pack.cursor++;

        // Store the updated pack
        packs[packs.length - 1] = pack;
    }
}
