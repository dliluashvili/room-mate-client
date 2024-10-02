import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
    overwrite: true,
    // schema: ['http://localhost:3000/graphql', './**/*.graphql'],
    schema: ['https://test-api.roommategeorgia.ge/graphql', './**/*.graphql'],
    generates: {
        'graphql/typesGraphql.ts': {
            plugins: ['typescript'],
            config: {
                useTypeImports: true,
            },
        },
    },
    hooks: { afterOneFileWrite: ['prettier --write'] },
}

export default config
