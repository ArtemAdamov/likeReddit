import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:3000/graphql",
  documents: "src/graphql/**/*.graphql",
  generates: {
    "src/generated/": {
        preset: "client",
        plugins: ["typescript-urql"
      ],
    }
  }
};

export default config;
