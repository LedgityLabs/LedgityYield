#!/bin/bash

forge coverage --report lcov

if ! command -v lcov &>/dev/null; then
    echo "'lcov' is not installed. Please install it and try again."
fi

lcov --rc branch_coverage=1 \
    --output-file lcov.info \
    --remove lcov.info "*test*" "node_modules" "LTokenSignaler.sol" "PreMining.sol" \
    --quiet

genhtml --flat --quiet --rc branch_coverage=1 \
        --output-directory coverage lcov.info \
        && open coverage/index.html