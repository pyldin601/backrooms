// @todo Needs to be aligned better with existing https://github.com/restreamio/restream-frontend/blob/master/tslint.json
//       For now it's mostly standard rules with some additions from CRA (https://github.com/facebook/create-react-app/blob/b3f8ef21a24f980244b64d41b86873c05eb97172/packages/eslint-config-react-app/index.js)
// @todo Add some plugins from Standard

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: false,
    },
    warnOnUnsupportedTypeScriptVersion: true,
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'padding-line-between-statements': [
      'error',
      // "if" statements should be wrapped with blank lines
      { blankLine: 'always', prev: ['*'], next: 'if' },
      { blankLine: 'always', prev: ['if'], next: ['*'] },
      // Add blank lines after variable definition
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
    ],

    // Some TS default rules tweaks
    '@typescript-eslint/no-inferrable-types': 0,

    // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
    'import/first': 2,
    'import/no-amd': 2,
    'import/no-webpack-loader-syntax': 2,
    'import/newline-after-import': 2,
    'import/export': 2,
    'import/no-mutable-exports': 2,
    'import/no-cycle': 2,
    'import/no-useless-path-segments': 2,
    'import/no-extraneous-dependencies': 2,
    // active later
    'import/no-namespace': 0,
    'import/no-duplicates': 2,
    'import/order': [
      2,
      {
        'newlines-between': 'always',
        groups: [
          ['builtin', 'external'],
          ['parent', 'internal', 'sibling', 'index', 'unknown'],
        ],
      },
    ],

    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
}
