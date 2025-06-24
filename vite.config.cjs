import { defineConfig } from 'vite'
const react = require('@vitejs/plugin-react');
const fs = require('fs');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/experts",
  server: {
    host: '0.0.0.0',
    port: 3000
  },
    build: {
        // Отключаем все что можно для экономии памяти
        sourcemap: false,
        minify: 'esbuild', // Быстрее чем terser
        target: 'es2020',
        reportCompressedSize: false,
        chunkSizeWarningLimit: 1000,

        rollupOptions: {
            output: {
                // Агрессивное разделение на chunks
                manualChunks: (id) => {
                    if (id.includes('node_modules')) {
                        if (id.includes('react') || id.includes('react-dom')) {
                            return 'react-vendor';
                        }
                        if (id.includes('@mui')) {
                            return 'mui-vendor';
                        }
                        if (id.includes('@emotion')) {
                            return 'emotion-vendor';
                        }
                        if (id.includes('axios')) {
                            return 'axios-vendor';
                        }
                        return 'vendor';
                    }
                }
            },
            // Ограничиваем параллельность
            maxParallelFileOps: 1
        }
    },

    // Отключаем предварительную сборку зависимостей
    optimizeDeps: {
        disabled: true
    },

    // Ограничиваем кеширование
    cacheDir: false
})
