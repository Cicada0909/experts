import { defineConfig } from 'vite'
const react = require('@vitejs/plugin-react');
const fs = require('fs');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/experts",
  server: {
    https: process.env.NODE_ENV === 'development' ? {
      key: fs.readFileSync('./ssl/key.pem'),
      cert: fs.readFileSync('./ssl/cert.pem'),
    } : undefined,
  },
})
