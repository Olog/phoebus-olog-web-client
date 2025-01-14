import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
      config: "/src/config",
      components: "/src/components",
      views: "/src/views",
      hooks: "/src/hooks",
      beta: "/src/beta",
      providers: "/src/providers",
      features: "/src/features",
      api: "/src/api",
      lib: "/src/lib",
      mocks: "/src/mocks",
      stories: "/src/stories",
      "test-utils": "/src/test-utils",
    },
  },
});
