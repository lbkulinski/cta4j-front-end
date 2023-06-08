import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: `https://main--logan-kulinskis-team-w5zqh7.apollographos.net/graphql`,
    documents: ['src/**/*.tsx'],
    generates: {
        './src/__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
            }
        }
    },
    ignoreNoDocuments: true,
};

export default config;