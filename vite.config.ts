import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            __API_BASE_URL__: JSON.stringify(env.VITE_API_BASE_URL ?? ''),
        },
    };
});
