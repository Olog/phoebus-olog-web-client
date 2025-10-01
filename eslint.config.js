import { defineConfig } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "typescript-eslint";
import cypress from "eslint-plugin-cypress";
import prettier from "eslint-config-prettier/flat";
import globals from "globals";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [
      js.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
      reactHooks.configs["recommended-latest"],
      importPlugin.flatConfigs.recommended,
      typescriptEslint.configs.recommended,
      cypress.configs.recommended,
      prettier
    ],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"]
      },
      "import/resolver": {
        alias: {
          map: [
            ["src", "./src"],
            ["config", "./src/config"],
            ["components", "./src/components"],
            ["views", "./src/views"],
            ["hooks", "./src/hooks"],
            ["providers", "./src/providers"],
            ["features", "./src/features"],
            ["api", "./src/api"],
            ["lib", "./src/lib"],
            ["mocks", "./src/mocks"],
            ["stories", "./src/stories"],
            ["test-utils", "./src/test-utils"]
          ],
          extensions: [".ts", ".tsx", ".js", ".jsx"]
        }
      },
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json"
      }
    },
    rules: {
      "react/prop-types": "off",
      "import/order": [
        "error",
        {
          groups: [
            "external",
            "index",
            "sibling",
            "parent",
            "internal",
            "builtin",
            "object",
            "type"
          ]
        }
      ],
      "import/no-duplicates": "error",
      "no-console": [
        "error",
        {
          allow: ["warn", "error", "info", "debug"]
        }
      ],
      "no-nested-ternary": "error",
      "no-unused-expressions": "error",
      "operator-assignment": ["error", "always"],
      yoda: "error",
      "react/jsx-boolean-value": "error",
      curly: ["error", "all"]
    }
  }
]);
