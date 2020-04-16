module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    amd: true,
    node: true,
    mocha: true
  },
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
    jsx: true,
    useJSXTextNode: true
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb',
    'prettier',
    'prettier/@typescript-eslint',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking'
  ],

  rules: {
    strict: 0,
    'import/no-dynamic-require': 1,
    'import/order': 0,
    'react/jsx-filename-extension': 0,
    'import/no-dynamic-require': 1,
    'global-require': 1,
    'no-use-before-define': 0,
    'consistent-return': 0,
    'import/no-unresolved': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 1,
    'react/no-array-index-key': 0,
    'react/prefer-stateless-function': 1,
    'no-param-reassign': 1,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react/prop-types': 0,
    'prefer-destructuring': 0,
    'react/destructuring-assignment': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'no-param-reassign': [
      2,
      { props: true, ignorePropertyModificationsFor: ['draft'] }
    ],
    'import/prefer-default-export': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-script-url': 0,
    'prettier/prettier': [1, { singleQuote: true }],
    'import/extensions': 0,
    '@typescript-eslint/no-var-requires': 1
  },
  globals: {
    $: false
  },
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  }
};
