import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["srcts/**/*.ts"],
    rules: {
      // Flow's `Object` and untyped cytoscape became `any`
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
      "consistent-return": "warn",
      eqeqeq: "error",
      "guard-for-in": "error",
      "no-console": "error",
      "no-fallthrough": "off",
      "no-var": "error",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        { allowShortCircuit: true },
      ],
      "prefer-const": "off",
    },
  }
);
