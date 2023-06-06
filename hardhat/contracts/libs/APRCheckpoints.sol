// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

library APRCheckpoints {
    /**
     * Note that this struct doesn't represent how checkpoints are stored on-chain (see "Packed APR checkpoints" section of whitepaper). They are simply used as a high level return type of some functions to provide good DX and code readability.
     */
    struct Checkpoint {
        uint16 aprUD3;
        uint40 timestamp;
    }

    struct Reference {
        // Allows up to 1.84E18 packs of 4 cursors to be represented.
        uint64 packIndex;
        uint8 cursorIndex;
    }

    struct Pack {
        uint16[4] aprsUD3; // Allows representing up to 65.536% APR (3 digits of precision)
        uint40[4] timestamps; // Allows representing datetime up to 20/02/36812
        uint32 cursor;
    }

    function incrementCheckpointReference(
        Reference memory ref
    ) public pure returns (Reference memory) {
        if (ref.cursorIndex != 5) ref.cursorIndex++;
        else ref.packIndex++;
        return ref;
    }

    function getCheckpointFromReference(
        Pack[] storage packs,
        Reference memory ref
    ) public view returns (Checkpoint memory checkpoint) {
        Pack memory pack = packs[ref.packIndex];
        return
            Checkpoint({
                aprUD3: pack.aprsUD3[ref.cursorIndex],
                timestamp: pack.timestamps[ref.cursorIndex]
            });
    }

    function getLatestCheckpointReference(
        Pack[] storage packs
    ) public view returns (Reference memory) {
        uint256 latestPackIndex = packs.length - 1;
        uint16 latestWrittenCursor = uint16(packs[latestPackIndex].cursor - 1);
        return
            Reference({
                packIndex: uint64(latestPackIndex),
                cursorIndex: uint8(latestWrittenCursor)
            });
    }

    /**
     * This function allows updating the current APR. Under the hood it writes a new APR checkpoint.
     * For more details, see "APR checkpoints" and "Packed APR checkpoints" sections of whitepaper.
     * @param aprUD3 The new APR to write in UD3 format (3 digit fixed point number, e.g., 12.345% = 12345)
     */
    function setAPR(Pack[] storage packs, uint16 aprUD3) public {
        // Retrieve last written pack
        APRCheckpoints.Pack memory writtenPack = packs[packs.length - 1];

        // If the pack is full, or is the first pack, create a new pack
        if (writtenPack.cursor == 5 || writtenPack.cursor == 0) {
            packs.push(
                APRCheckpoints.Pack({
                    aprsUD3: [uint16(0), uint16(0), uint16(0), uint16(0)],
                    timestamps: [uint40(0), uint40(0), uint40(0), uint40(0)],
                    cursor: 1
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
