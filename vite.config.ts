import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    target: 'es6',
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/components/index.ts'),
      name: 'Station-UI',
    },
    rollupOptions: {
      external: ['react'],
      output: {
        globals: {
          react: 'React'
        }
      },
    },
  },
  plugins: [
    svgr(),
    react(),
    tsconfigPaths(),
    dts(),
  ],
  resolve: {
    alias: {
      'scss': '/src/styles'
    }
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]",
    }
  }
})
