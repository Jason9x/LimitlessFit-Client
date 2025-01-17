import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname
})

const eslintConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:prettier/recommended'
  ),
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          trailingComma: 'none',
          printWidth: 80,
          tabWidth: 2,
          useTabs: false,
          bracketSpacing: true,
          jsxBracketSameLine: false,
          arrowParens: 'avoid',
          endOfLine: 'auto'
        }
      ],
      'arrow-body-style': ['error', 'as-needed'],
      curly: ['error', 'multi'],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
]

export default eslintConfig
