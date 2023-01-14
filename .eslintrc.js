module.exports = {
   parser: "@typescript-eslint/parser",
   plugins: ["react", "@typescript-eslint"],
   extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:react-hooks/recommended",
      "plugin:@typescript-eslint/recommended",
      "prettier",
   ],
   env: {
      browser: true,
      es2021: true,
      node: true,
   },
   settings: {
      react: {
         version: "detect",
      },
   },
   ignorePatterns: ["**/node_modules/**", "**/dist/**", "**/tmp-*/**"],
   rules: {
      // https://github.com/microsoft/playwright/issues/8798
      "no-empty-pattern": "off",
      // Allow unused symbols that start with an underscore.
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
};
