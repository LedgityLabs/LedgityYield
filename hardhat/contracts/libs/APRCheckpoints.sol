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
}
