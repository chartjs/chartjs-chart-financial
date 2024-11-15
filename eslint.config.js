import es from "eslint-plugin-es-x";
import html from "eslint-plugin-html";
import markdown from "eslint-plugin-markdown";
import globals from "globals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
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
    allConfig: js.configs.all
});

export default [
    { ignores: ["**/*\\{.,-}min.js", "docs/Chart.Financial.js"] },
    ...compat.extends("chartjs", "plugin:es-x/restrict-to-es2022"),
    ...markdown.configs.recommended,
    {
        files: ["**/*.html"],
        plugins: { html },
    },
    {
        plugins: {
            es
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,

                // TODO: it would be nicer to apply these only to tests
                afterEach: "readonly",
                describe: "readonly",
                expect: "readonly",
                it: "readonly"
            },

            ecmaVersion: 2022,
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    impliedStrict: true,
                    modules: true,
                },
            },
        },

        settings: {
            es: {
                aggressive: true,
            },
        },

        rules: {
            "class-methods-use-this": "off",
            complexity: ["warn", 10],
            "max-statements": ["warn", 30],
            "no-empty-function": "off",

            "no-use-before-define": ["error", {
                functions: false,
            }],

            "es/no-import-meta": "off",
            "es/no-async-iteration": "error",
            "es/no-malformed-template-literals": "error",
            "es/no-regexp-lookbehind-assertions": "error",
            "es/no-regexp-named-capture-groups": "error",
            "es/no-regexp-s-flag": "error",
            "es/no-regexp-unicode-property-escapes": "error",
            "es/no-dynamic-import": "off",
        },
    },
    ...compat.extends("chartjs", "plugin:@typescript-eslint/recommended").map(config => ({
        ...config,
        files: ["**/*.ts"],
    })),
    {
        files: ["**/*.ts"],

        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
        },

        rules: {
            complexity: ["warn", 10],
            "max-statements": ["warn", 30],
            indent: "off",
            "@typescript-eslint/indent": ["error", 2],
            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": "error",
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "space-before-function-paren": "off",
            "@typescript-eslint/space-before-function-paren": [2, "never"],
        },
    }
];
