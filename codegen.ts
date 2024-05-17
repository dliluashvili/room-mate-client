import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: ["http://localhost:3000/graphql", "./**/*.graphql"],
  generates: {
    "gql/graphql.ts": {
      plugins: ["typescript"],
      config: {
        useTypeImports: true,
        scalars: {
          Message: {
            input: "Message",
            output: "Message",
          },
        },
      },
    },
  },
  // hooks: { afterOneFileWrite: ['prettier --write'] },
};

export default config;
