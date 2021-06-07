
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  extends: [
    'standard' // Out of the box StandardJS rules
  ],
  plugins: [
    '@typescript-eslint' // Let's us override rules below.
  ],
  rules: {
    // Prevent unused vars errors when variables are only used as TS types
    // see: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md#options
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false
      }
    ],
    'no-unused-vars': 'off'
  }
}
