module.exports = {
  semi: true,
  trailingComma: "all",
  singleQuote: false,
  printWidth: 80,
  overrides: [
    {
      files: ".eslintrc.mjs",
      options: {
        singleQuote: true,
        trailingComma: "none",
      },
    },
  ],
};
