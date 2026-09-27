import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the build works under any GitHub Pages sub-path
// (e.g. https://<user>.github.io/Timer/) or a custom domain.
export default defineConfig({
  base: './',
  plugins: [react()],
})
