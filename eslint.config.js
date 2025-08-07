import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import cypress from 'eslint-plugin-cypress'
import prettier from 'eslint-plugin-prettier'

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': typescriptEslint,
      import: importPlugin,
      cypress: cypress,
      prettier: prettier,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
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
            'type'
          ]
        }
      ],
      'no-console': [
        'error',
        {
          allow: ['warn', 'error', 'info', 'debug']
        }
      ],
      curly: ['error', 'all'],
    },
    settings: {
      react: {
        version: 'detect',
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
            ['test-utils', './src/test-utils']
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        }
      }
    },
    ignores: ['node_modules/', 'dist/', '.git/', '*.min.js']
  }
]