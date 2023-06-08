// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library APRCheckpoints {
    /**
     * @dev High-level representation of an APR checkpoint. It doesn't represent how
     * checkpoints are stored on-chain (see "Packed APR checkpoints" section of whitepaper)
     * @param aprUD3 The APR in UD3 format (3 digit fixed point number, e.g., 12.345% = 12345)
     * @param timestamp The timestamp of the checkpoint
     */
    struct Checkpoint {
        uint16 aprUD3;
        uint40 timestamp;
    }

    /**
     * @dev Represents a reference to an APR checkpoint. A reference allows to identify
     * and acess an APR checkpoint stored in an array of packs.
     * @param packIndex The index of the pack the checkpoint belongs to in the array of packs.
     * @param cursorIndex The index of the checkpoint in this pack (between 0 and 3, 4 checkpoints
     * per pack)
     */
    struct Reference {
        uint64 packIndex;
        uint8 cursorIndex;
    }

    /**
     * @dev Represents gas-efficient checkpoints storage on-chain. Each can hold up to 4 checkpoints.
     * @param aprsUD3 The checkpoints' APRs in UD3 format
     * @param timestamps The checkpoints' timestamps
     * @param cursor The index of the next checkpoint to be written
     */
    struct Pack {
        uint16[4] aprsUD3; // Allows representing up to 65.536% APR (3 digits of precision)
        uint40[4] timestamps; // Allows representing datetime up to 20/02/36812
        uint32 cursor;
    }

    /**
     * @dev Returns the reference of the checkpoint that follows the checkpoint represented
     * by the given reference.
     * @param ref The reference to be incremented
     * @return The incremented reference
     */
    function incrementCheckpointReference(Reference memory ref) public pure returns (Reference memory) {
        // If the checkpoint is not the last of the pack, increment the cursor index.
        if (ref.cursorIndex < 4) {
            ref.cursorIndex++;
        }
        // Else jump to the first checkpoint slot of the next pack.
        else {
            ref.packIndex++;
            ref.cursorIndex = 0;
        }
        return ref;
    }

    /**
     * @dev Extacts a checkpoint object from array of packs from a given reference.
     * @param packs The array of packs to extract the checkpoint from
     * @param ref The reference to the checkpoint to extract
     * @return checkpoint The extracted checkpoint
     */
    function getCheckpointFromReference(
        Pack[] storage packs,
        Reference memory ref
    ) public view returns (Checkpoint memory checkpoint) {
        // Extract pack containing the checkpoint
        Pack memory pack = packs[ref.packIndex];

        // Build and return the checkpoint as a Checkpoint object
        return
            Checkpoint({
                aprUD3: pack.aprsUD3[ref.cursorIndex],
                timestamp: pack.timestamps[ref.cursorIndex]
            });
    }

    /**
     * @dev Compute the reference of the latest checkpoint written in the given array of packs.
     * @param packs The array of packs to compute the reference from
     * @return The reference of the latest checkpoint
     */
    function getLatestCheckpointReference(Pack[] storage packs) public view returns (Reference memory) {
        uint64 latestPackIndex = uint64(packs.length - 1);
        uint8 latestWrittenCursor = uint8(packs[latestPackIndex].cursor - 1);
        return Reference({packIndex: latestPackIndex, cursorIndex: latestWrittenCursor});
    }

    /**
     * This function allows updating the current APR. Under the hood it writes a new APR checkpoint.
     * For more details, see "APR checkpoints" and "Packed APR checkpoints" sections of whitepaper.
     * @param packs The array of packs to append the checkpoint to
     * @param aprUD3 The new APR to write in UD3 format (3 digit fixed point number, e.g., 12.345% = 12345)
     */
    function setAPR(Pack[] storage packs, uint16 aprUD3) public {
        // Retrieve last written pack
        APRCheckpoints.Pack memory writtenPack = packs[packs.length - 1];

        // If the pack is full (4) or is the first pack ever (0)
        if (writtenPack.cursor == 4 || writtenPack.cursor == 0) {
            // Create a new pack
            packs.push(
                APRCheckpoints.Pack({
                    aprsUD3: [uint16(0), uint16(0), uint16(0), uint16(0)],
                    timestamps: [uint40(0), uint40(0), uint40(0), uint40(0)],
                    cursor: 0
                })
            );
            writtenPack = packs[packs.length - 1];
        }
        // Write the new checkpoint at current pack cursor
        writtenPack.aprsUD3[writtenPack.cursor] = aprUD3;
        writtenPack.timestamps[writtenPack.cursor] = uint40(block.timestamp);

        // Increment write cursor
        writtenPack.cursor++;

        // Store the updated pack
        packs[packs.length - 1] = writtenPack;
    }
}
