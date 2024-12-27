import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
   baseDirectory: __dirname,
   recommendedConfig: js.configs.recommended,
   allConfig: js.configs.all,
});

export default [
   {
      ignores: ["**/node_modules/**/*", "**/dist/**/*", "**/tmp-*/**/*"],
   },
   ...fixupConfigRules(
      compat.extends(
         "eslint:recommended",
         "plugin:react/recommended",
         "plugin:react-hooks/recommended",
         "plugin:@typescript-eslint/recommended",
         "prettier",
      ),
   ),
   {
      plugins: {
         react: fixupPluginRules(react),
         "@typescript-eslint": fixupPluginRules(typescriptEslint),
      },

      languageOptions: {
         globals: {
            ...globals.browser,
            ...globals.node,
         },

         parser: tsParser,
      },

      settings: {
         react: {
            version: "detect",
         },
      },

      rules: {
         // https://github.com/microsoft/playwright/issues/8798
         "no-empty-pattern": "off",

         "@typescript-eslint/no-unused-vars": [
            "warn",
            {
               argsIgnorePattern: "^_",
               varsIgnorePattern: "^_",
               caughtErrorsIgnorePattern: "^_",
            },
         ],

         "@typescript-eslint/explicit-module-boundary-types": "off",
      },
   },
];
