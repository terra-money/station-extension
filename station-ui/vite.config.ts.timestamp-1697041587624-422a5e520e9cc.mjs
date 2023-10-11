// vite.config.ts
import path from "path";
import { defineConfig } from "file:///Users/eric/Desktop/GITHUB/station-wallet/station-ui/node_modules/vite/dist/node/index.js";
import react from "file:///Users/eric/Desktop/GITHUB/station-wallet/station-ui/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///Users/eric/Desktop/GITHUB/station-wallet/station-ui/node_modules/vite-plugin-svgr/dist/index.js";
import tsconfigPaths from "file:///Users/eric/Desktop/GITHUB/station-wallet/station-ui/node_modules/vite-tsconfig-paths/dist/index.mjs";
import dts from "file:///Users/eric/Desktop/GITHUB/station-wallet/station-ui/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/eric/Desktop/GITHUB/station-wallet/station-ui";
var vite_config_default = defineConfig({
  build: {
    target: "es6",
    sourcemap: true,
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/components/index.ts"),
      name: "Station-UI"
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "React"
        }
      }
    }
  },
  plugins: [
    svgr(),
    react(),
    tsconfigPaths(),
    dts()
  ],
  resolve: {
    alias: {
      "scss": "/src/styles"
    }
  },
  css: {
    modules: {
      generateScopedName: "[name]__[local]___[hash:base64:5]"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvZXJpYy9EZXNrdG9wL0dJVEhVQi9zdGF0aW9uLXdhbGxldC9zdGF0aW9uLXVpXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvZXJpYy9EZXNrdG9wL0dJVEhVQi9zdGF0aW9uLXdhbGxldC9zdGF0aW9uLXVpL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9lcmljL0Rlc2t0b3AvR0lUSFVCL3N0YXRpb24td2FsbGV0L3N0YXRpb24tdWkvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBzdmdyIGZyb20gJ3ZpdGUtcGx1Z2luLXN2Z3InXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJ1xuaW1wb3J0IGR0cyBmcm9tICd2aXRlLXBsdWdpbi1kdHMnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzNicsXG4gICAgc291cmNlbWFwOiB0cnVlLFxuICAgIGxpYjoge1xuICAgICAgZW50cnk6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29tcG9uZW50cy9pbmRleC50cycpLFxuICAgICAgbmFtZTogJ1N0YXRpb24tVUknLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFsncmVhY3QnXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBnbG9iYWxzOiB7XG4gICAgICAgICAgcmVhY3Q6ICdSZWFjdCdcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICBwbHVnaW5zOiBbXG4gICAgc3ZncigpLFxuICAgIHJlYWN0KCksXG4gICAgdHNjb25maWdQYXRocygpLFxuICAgIGR0cygpLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdzY3NzJzogJy9zcmMvc3R5bGVzJ1xuICAgIH1cbiAgfSxcbiAgY3NzOiB7XG4gICAgbW9kdWxlczoge1xuICAgICAgZ2VuZXJhdGVTY29wZWROYW1lOiBcIltuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XVwiLFxuICAgIH1cbiAgfVxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBOFUsT0FBTyxVQUFVO0FBQy9WLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxTQUFTO0FBTGhCLElBQU0sbUNBQW1DO0FBUXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLEtBQUs7QUFBQSxNQUNILE9BQU8sS0FBSyxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLE1BQ3hELE1BQU07QUFBQSxJQUNSO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsT0FBTztBQUFBLE1BQ2xCLFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxRQUNUO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxLQUFLO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxJQUFJO0FBQUEsRUFDTjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLElBQ1Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxLQUFLO0FBQUEsSUFDSCxTQUFTO0FBQUEsTUFDUCxvQkFBb0I7QUFBQSxJQUN0QjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
