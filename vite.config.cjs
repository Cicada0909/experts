import { defineConfig } from 'vite'
const react = require('@vitejs/plugin-react')
const fs = require('fs')

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    server: {
        host: '0.0.0.0',
        port: 3000,
    },
})
