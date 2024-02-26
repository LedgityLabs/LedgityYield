// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title APRHistory
 * @author Lila Rest (https://lila.rest)
 * @custom:security-contact security@ledgity.com
 *
 * @notice This library offers utilities to efficiently maintain the history of an
 * on-chain APR (Annual Percentage Rate) state. Each entry in this history is called
 * a "checkpoint".
 *
 * @dev Intuition:
 * Each checkpoint in an APR history consists of two data:
 * - the creation timestamp
 * - the APR at that time
 *
 * Given that reading and writing to storage slots are among the most costly operations
 * in Solidity, this library provides a way to store those data in a way that minimizes
 * the number of used storage slots.
 *
 * Instead of storing each checkpoint in a separate storage slot, this library
 * facilitates the packing of up to 4 checkpoints in a single storage slot.
 *
 * @dev Definitions:
 * - Checkpoint: A record of an APR change
 * - Pack: A collection of 4 checkpoints stored in a single storage slot
 * - History: A dynamic array of packs
 * - Reference: A storage pointer to a checkpoint in the APR history
 * - CheckpointData: An in-memory representation of a checkpoint data
 *
 * @dev Value limitation:
 * This library can accommodate APRs only up to 65.536%. This is however sufficient for
 * APR in LToken contract, which is expected to remain below 10%.
 *
 * @dev For further details, see "APRHistory" section of whitepaper.
 * @custom:security-contact security@ledgity.com
 */
library APRHistory {
    /**
     * @notice Represents data of a checkpoint extracted from the on-chain history.
     * For on-chain representation see "Pack" struct.
     * @param aprUD7x3 APR in UD7x3 format (e.g., 12345 = 12.345%).
     * @param timestamp Timestamp of the checkpoint's creation.
     */
    struct CheckpointData {
        uint16 aprUD7x3; // Allows up to 65.536%
        uint40 timestamp; // Supports dates up to 20/02/36812
    }

    /**
     * @notice Represents how APR checkpoints are stored on chain. Each pack can contain
     * the data 4 checkpoints. Packs are then stored in a dynamic array (the history).
     * @param aprsUD7x3 Array of checkpoints' APRs.
     * @param timestamps Array of checkpoints' timestamps.
     * @param cursor Index of the next checkpoint to be written.
     */
    struct Pack {
        uint16[4] aprsUD7x3;
        uint40[4] timestamps;
        uint32 cursor;
    }

    /**
     * @notice Represents a storage pointer to a specific checkpoint in the history.
     * @param packIndex Index of the pack the checkpoint belongs to.
     * @param cursorIndex Index of the checkpoint in this pack (between 0 and 3).
     */
    struct Reference {
        uint256 packIndex;
        uint32 cursorIndex;
    }

    /**
     * @notice Compares two checkpoints references.
     * @param ref1 The first reference to compare.
     * @param ref2 The second reference to compare.
     * @return Whether the two references points to the same checkpoint.
     */
    function eq(Reference memory ref1, Reference memory ref2) external pure returns (bool) {
        return ref1.packIndex == ref2.packIndex && ref1.cursorIndex == ref2.cursorIndex;
    }

    /**
     * @notice Returns the reference of the checkpoint that should come right after the
     * referenced checkpoint in the APR history.
     * @param ref The reference to be incremented.
     * @return The incremented reference.
     */
    function incrementReference(Reference memory ref) public pure returns (Reference memory) {
        // Ensure cursor index of the given ref is within valid range [0, 3]
        require(ref.cursorIndex <= 3, "L1");

        // If the given ref is the last slot in its pack, return ref of next pack's first slot
        if (ref.cursorIndex == 3) return Reference(ref.packIndex + 1, 0);
        //
        // Else, return ref of next slot in current pack
        else return Reference(ref.packIndex, ref.cursorIndex + 1);
    }

    /**
     * @notice Extracts checkpoint data from a given reference and in APR history.
     * @param self The APR history to extract the checkpoint from.
     * @param ref The reference of the checkpoint data to extract.
     * @return The extracted checkpoint's data.
     */
    function getDataFromReference(
        Pack[] storage self,
        Reference memory ref
    ) public view returns (CheckpointData memory) {
        // Ensure cursor index of the given ref is within valid range [0, 3]
        require(ref.cursorIndex <= 3, "L2");

        // Ensure pack index of the given ref exists in history
        require(ref.packIndex < self.length, "L3");

        // Retrieve pack data from history
        Pack memory pack = self[ref.packIndex];

        // Ensure cursor index of the given ref has been written
        require(ref.cursorIndex < pack.cursor, "L4");

        // Build and return the checkpoint data
        return
            CheckpointData({
                aprUD7x3: pack.aprsUD7x3[ref.cursorIndex],
                timestamp: pack.timestamps[ref.cursorIndex]
            });
    }

    /**
     * @notice Retrieves the reference to the most recently added checkpoint in the APR history.
     * @param self The history to extract the reference from.
     * @return The reference of the latest checkpoint.
     */
    function getLatestReference(Pack[] storage self) public view returns (Reference memory) {
        // Ensure the given history is not empty
        require(self.length != 0, "L5");

        // Retrieve latest pack's index and cursor
        uint256 packIndex = self.length - 1;
        uint32 packCursor = self[packIndex].cursor;

        // If this is the first pack ever, ensure it is not empty
        if (packIndex == 0) require(packCursor != 0, "L6");

        // If the pack is empty, return ref of previous pack's latest slot
        if (packCursor == 0) return Reference(packIndex - 1, 3);
        //
        // Else, return ref of previous slot in current pack
        else return Reference(packIndex, packCursor - 1);
    }

    /**
     * @notice Appends a new empty pack to the end of the given APR history array.
     * @param self The APR history to append an empty to.
     */
    function newBlankPack(Pack[] storage self) internal {
        // If history is not empty, ensure the latest pack is full
        require(self.length == 0 || getLatestReference(self).cursorIndex == 3, "L7");

        // Push a new blank pack to the history array
        self.push(
            Pack({
                aprsUD7x3: [uint16(0), uint16(0), uint16(0), uint16(0)],
                timestamps: [uint40(0), uint40(0), uint40(0), uint40(0)],
                cursor: 0
            })
        );
    }

    /**
     * @notice Write a new APR checkpoint at the end of the given history array.
     * @param self The array of packs to write the new checkpoint to.
     * @param aprUD7x3 The new APR in UD7x3 format.
     */
    function setAPR(Pack[] storage self, uint16 aprUD7x3) external {
        // Determine the reference where the new checkpoint should be written
        Reference memory newRef = self.length == 0
            ? Reference(0, 0)
            : incrementReference(getLatestReference(self));

        // If pack to be written doesn't exist yet, push a new blank pack in history
        if (newRef.packIndex >= self.length) newBlankPack(self);

        // Retrieve the pack where the new checkpoint will be stored
        Pack memory pack = self[newRef.packIndex];

        // Add new checkpoint's data to the pack
        pack.aprsUD7x3[newRef.cursorIndex] = aprUD7x3;
        pack.timestamps[newRef.cursorIndex] = uint40(block.timestamp);

        // Increment the pack's cursor
        pack.cursor++;

        // Write the updated pack in storage
        self[newRef.packIndex] = pack;
    }

    /**
     * @notice Retrieves the APR of the latest checkpoint written in the APR history.
     * @param self The history array to read APR from.
     * @return The latest checkpoint's APR.
     */
    function getAPR(Pack[] storage self) public view returns (uint16) {
        // Retrieve the latest checkpoint data
        Reference memory ref = getLatestReference(self);
        CheckpointData memory data = getDataFromReference(self, ref);

        // Return the latest checkpoint's APR
        return data.aprUD7x3;
    }
}
