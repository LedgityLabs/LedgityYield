module.exports = {
  plugins: [
    "prettier-plugin-solidity",
    // "prettier-plugin-jsdoc",
    // "prettier-plugin-tailwindcss",
  ],
  tailwindAttributes: ["className"],
  tailwindFunctions: ["clsx", "twMerge"],

  // Note that Solidity's Style Guide suggests a maximum line length of 120 characters.
  // See: https://docs.soliditylang.org/en/v0.8.17/style-guide.html#maximum-line-length
  printWidth: 100,

  // Those explicit declarations are required because of a bug with pnpm.
  // See: https://github.com/prettier-solidity/prettier-plugin-solidity#pnpm
  overrides: [
    {
      files: "**/*.sol",
      options: {
        parser: "solidity-parse",
      },
    },
  ],
};
