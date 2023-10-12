import { resolve } from 'path'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig({
  plugins: [
    createHtmlPlugin({ minify: true }),
    viteSingleFile({ inlinePattern: ['**/*.css'], useRecommendedBuildConfig: false })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        blog: resolve(__dirname, 'blog/index.html'),
      },
    },
  }
})