import globals from "globals";
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import cypress from 'eslint-plugin-cypress'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
      cypress: cypress,
      prettier: prettier,
    },
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      // like env in .eslintrc
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
      'import/resolver': {
        alias: {
          map: [
            ['src', './src'],
            ['config', './src/config'],
            ['components', './src/components'],
            ['views', './src/views'],
            ['hooks', './src/hooks'],
            ['providers', './src/providers'],
            ['features', './src/features'],
            ['api', './src/api'],
            ['lib', './src/lib'],
            ['mocks', './src/mocks'],
            ['stories', './src/stories'],
            ['test-utils', './src/test-utils'],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },

    rules: {
      // like extends in .eslintrc
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules,
      ...cypress.configs.recommended.rules,
      ...prettier.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...importPlugin.configs.typescript.rules,
      // React
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-boolean-value': 'warn',
      'react/no-danger': 'warn',
      'react/no-multi-comp': [
        'warn',
        {
          ignoreStateless: true,
        },
      ],
      'react/prefer-es6-class': 'warn',
      'react/self-closing-comp': 'error',
      'react-refresh/only-export-components': 'warn',

      // Import
      'import/order': [
        'error',
        {
          groups: [
            'external',
            'index',
            'sibling',
            'parent',
            'internal',
            'builtin',
            'object',
            'type',
          ],
        },
      ],
      'import/no-named-as-default': 'error',
      'import/no-named-as-default-member': 'error',
      'import/no-unresolved': [
        'error',
        { caseSensitive: false, commonjs: true, amd: true },
      ],
      'import/no-duplicates': 'error',

      // General
      'consistent-this': ['error', 'self'],
      'default-case': 'error',
      'dot-notation': 'error',
      eqeqeq: [
        'error',
        'always',
        {
          null: 'ignore',
        },
      ],
      'no-console': [
        'error',
        {
          allow: ['warn', 'error', 'info', 'debug'],
        },
      ],
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-lone-blocks': 'error',
      'no-nested-ternary': 'error',
      'no-object-constructor': 'error',
      'no-octal-escape': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-undef-init': 'error',
      'no-unused-expressions': 'error',
      'operator-assignment': ['error', 'always'],
      quotes: [
        'error',
        'double',
        {
          avoidEscape: true,
        },
      ],
      radix: 'error',
      yoda: 'error',
      curly: ['error', 'all'],
    },
    ignores: ['node_modules/', 'dist/', '.git/', '*.min.js'],
  },
  // Overrides
  {
    files: ['**/*.stories.*'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['**/mocks/mockAPI.js', '**/index.js', 'cypress.config.js'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: [
      '**/*.spec.js',
      '**/*.spec.jsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '*.test.js',
      'setupTests.js',
      '*.tsx',
      '*.ts',
      '*.jsx',
      '*.js',
      '*.cy.js',
    ],
  },
]
