import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    rules: {
      // we can override some problematic import rules here
      // that can cause issues when using import aliases.
      'import/extensions': 'off',
      'import/no-extraneous-dependencies': 'off',

      // functions are always hoisted, so we can use them before they are defined
      // which in various cases improves readability
      'no-use-before-define': ['error', {functions: false}],
      '@typescript-eslint/no-use-before-define': ['error', {functions: false}],

      'import/prefer-default-export': 'off',
      'no-console': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/no-unknown-property': 'off'
    }
  },
  {
    languageOptions: {globals: globals.browser}
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettier
]
