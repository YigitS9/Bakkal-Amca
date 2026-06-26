import tseslint from "typescript-eslint";

export default [
  {
    ignores: [".next/**", "node_modules/**", "prisma/dev.db*", "next-env.d.ts"]
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ]
    }
  }
];
