// SPDX-License-Identifier: Apache-2.0

// https://github.com/lint-staged/lint-staged?tab=readme-ov-file#using-js-configuration-files
module.exports = {
    // lint-staged appends all matched files at the end of the command
    // https://github.com/lint-staged/lint-staged?tab=readme-ov-file#what-commands-are-supported
    '*.json': 'prettier --write',
    '*.md': 'prettier --write',

    // Check `package.json` files have appropriate `Apache-2.0` license and author
    // https://github.com/lint-staged/lint-staged?tab=readme-ov-file#example-wrap-filenames-in-single-quotes-and-run-once-per-file
    'package.json': files =>
        files.flatMap(file => [
            `grep --quiet '"license"\\s*:\\s*"Apache-2.0"' ${file}`,
            `grep --quiet '"author"\\s*:\\s*"2024 Hedera Hashgraph, LLC"' ${file}`,
        ]),

    // Check Solidity files have appropriate `Apache-2.0` license identifier
    // https://github.com/lint-staged/lint-staged?tab=readme-ov-file#example-wrap-filenames-in-single-quotes-and-run-once-per-file
    '*.sol': files =>
        files.map(file => `grep --quiet "SPDX-License-Identifier: Apache-2.0" ${file}`),

    // Apply linter and prettier rules.
    // See `eslint.config.js` and `.prettierrc.json` for details.
    '*.{js,d.ts}': ['eslint --fix', 'prettier --write'],
};
