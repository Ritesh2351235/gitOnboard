/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": true
  },
  "plugins": [
    "@typescript-eslint",
    "react",
    "next"
  ],
  "extends": [
    "plugin:react/recommended",
    "plugin:next/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    // Add any custom rules here
  }
}

module.exports = config;