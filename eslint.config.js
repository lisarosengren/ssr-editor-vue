import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import pluginCypress from 'eslint-plugin-cypress'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default defineConfig([
  {
    name: 'app/files-to-lint',
    files: ['**/*.{js,mjs,jsx,vue}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  {
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  { rules: {
        "indent": [
            2,
            4,
            {
              "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            2,
            "unix"
        ],
        "eol-last": 2,
        "no-trailing-spaces": 2,
        "semi": [
            2,
            "always"
        ],
        "camelcase": [
            2,
            {
              "properties": "never"
            }
        ],
        "curly": [
            2,
            "all"
        ],
        "brace-style": [
            2,
            "1tbs",
            {
              "allowSingleLine": true
            }
        ],
        "no-with": 2,
        "keyword-spacing": [
            2,
            {}
        ],
        "space-before-blocks": [
            2,
            "always"
        ],
        "space-before-function-paren": [
            2,
            {
              "anonymous": "ignore",
              "named": "never"
            }
        ],
        "comma-spacing": [
            2,
            {
              "after": true,
              "before": false
            }
        ],
        "semi-spacing": [
            2,
            {
              "before": false,
              "after": true
            }
        ],
        "key-spacing": [
            2,
            {
              "beforeColon": false,
              "afterColon": true,
              "mode": "minimum"
            }
        ],
        "padded-blocks": [
            2,
            "never"
        ],
        "newline-after-var": [
            2,
            "always"
        ],
        "max-len": [
            2,
            100
        ],
        "comma-style": [
            2,
            "last"
        ],
        "no-multi-str": 2,
        "wrap-iife": [
            "error",
            "any"
        ],
        "no-console": 0
    },
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },

  {
    ...pluginCypress.configs.recommended,
    files: [
      'cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}',
      'cypress/support/**/*.{js,ts,jsx,tsx}'
    ],
  },
  skipFormatting,
])
