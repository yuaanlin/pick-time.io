// last update 2022/5/26
// https://gist.github.com/ken20001207/dcf9e4e5f10d44a3faa511bebd55437f/

// eslint-disable-next-line max-len
// pnpm i -D typescript eslint eslint-plugin-react @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import

module.exports = {
  env: { browser: true },
  extends: ['plugin:react/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: { jsx: true },
    ecmaVersion: 12,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  settings: { react: { version: 'detect' } },
  plugins: ['react', '@typescript-eslint', 'import'],
  rules: {
    'no-unused-vars': 'off',
    'no-invalid-this': 'off',
    'require-jsdoc': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    'max-len': [
      'warn',
      80,
      {
        ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
        ignoreUrls: true,
      },
    ],
    'quote-props': ['warn', 'consistent-as-needed'],
    'indent': ['warn', 2, { SwitchCase: 1 }],
    'react/jsx-indent': ['warn', 2],
    'react/jsx-indent-props': ['warn', 2],
    'quotes': ['warn', 'single'],
    'semi': ['warn', 'always'],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'require',
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'ok'],
      },
    ],
    'object-curly-newline': ['warn', { multiline: true }],
    'object-curly-spacing': ['warn', 'always'],
    'comma-spacing': ['warn', { before: false, after: true }],
    'no-multi-spaces': ['warn'],
    'import/order': [
      'warn', {
        groups: [
          'index',
          'sibling',
          'parent',
          'internal',
          'external',
          'builtin',
          'object',
          'type'
        ]
      }
    ],
    'react/react-in-jsx-scope': 'off',
    'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 1, maxBOF: 0 }],
    'eol-last': 1,
    'react/jsx-first-prop-new-line': ['warn', 'multiline'],
    'react/jsx-max-props-per-line': ['warn', { maximum: 1, when: 'multiline' }],
    'array-element-newline': ['warn', 'consistent'],
    'jsx-quotes': ['warn', 'prefer-double'],
    'array-bracket-newline': ['warn', { multiline: true }],
    'no-trailing-spaces': 'warn',
    'space-in-parens': ['warn', 'never'],
  },
};
