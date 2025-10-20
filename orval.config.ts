// orval.config.ts
import { defineConfig } from 'orval';

export default defineConfig({
    cta4j: {
        // JSON works fine
        input: './src/api/cta4j.json',
        output: {
            target: './src/api/generated/cta4j.ts',
            schemas: './src/api/generated/model',
            client: 'fetch',
            override: {
                mutator: {
                    path: './src/api/fetcher.ts',
                    name: 'customFetcher',
                },
            },
        },
    },
});
