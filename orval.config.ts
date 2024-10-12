import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: './spec.json',
    output: {
      target: './src/api/generated.ts',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/api/custom-instance.ts',
          name: 'customInstance',
        },
      }
    }
  }
});
