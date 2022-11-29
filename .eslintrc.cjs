module.exports = {
  root: true,
  ignorePatterns: [
    "coverage/",
    "pnpm-global/",
    "out/",
    "template/",
  ],
  extends: ["@peggyjs"],
  plugins: ["node"],
  env: {
    es2020: true,
  },
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2021,
  },
  rules: {
    "spaced-comment": [
      "error",
      "always",
      {
        line: {
          markers: ["/", "#region", "#endregion"],
        },
        block: { markers: ["*"], balanced: true },
      },
    ],
  },
  overrides: [
    {
      files: ["*.ts"],
      plugins: ["tsdoc"],
      extends: ["plugin:@typescript-eslint/recommended"],
      rules: {
        "@typescript-eslint/comma-dangle": ["error", {
          "arrays": "only-multiline",
          "objects": "only-multiline",
          "imports": "never",
          "exports": "never",
          "functions": "never",
        }],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-unused-vars": ["error", {
          argsIgnorePattern: "_",
          varsIgnorePattern: "_",
        }],
        "tsdoc/syntax": "error",
      },
    },
  ],
};
