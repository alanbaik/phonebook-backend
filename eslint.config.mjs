import js from "@eslint/js";
import globals from "globals";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs}"],
		languageOptions: { globals: globals.node },
		plugins: { js, "@stylistic": stylistic },
		extends: ["js/recommended"],
		rules: {
			eqeqeq: "error",
			"@stylistic/no-trailing-spaces": "error",
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/arrow-spacing": ["error", { before: true, after: true }],
			"no-console": "off",
		},
	},
	globalIgnores(["dist/**"]),
]);
