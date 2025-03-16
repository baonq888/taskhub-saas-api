import globals from "globals";
import js from "@eslint/js";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config} */ 
export default [
  js.configs.recommended, 
  {
    languageOptions: {
      globals: {
        ...globals.node,   
        ...globals.browser 
      }
    },
    plugins: {
      import: importPlugin, 
    },
    rules: {
      "import/no-unresolved": "error"
    }
  }
];