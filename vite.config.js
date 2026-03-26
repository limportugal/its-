import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
            '@css': path.resolve(__dirname, './resources/css'),
            'ziggy-js': path.resolve(__dirname, './vendor/tightenco/ziggy'),
        },
    },
    build: {
        chunkSizeWarningLimit: 1000,
        reportCompressedSize: false,
        rollupOptions: {
            onwarn(warning, warn) {
                // SUPPRESS EVAL WARNING FROM PDFJS-DIST
                if (warning.code === 'EVAL' && warning.id?.includes('pdfjs-dist')) {
                    return;
                }
                warn(warning);
            },
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    mui: ['@mui/material', '@mui/icons-material'],
                    inertia: ['@inertiajs/react', '@inertiajs/core'],
                    pdfjs: ['pdfjs-dist'],
                },
            },
        },
    },
    optimizeDeps: {
        include: ['react', 'react-dom', '@mui/material', '@inertiajs/react'],
    },
});

