import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@/": resolve(__dirname, "./src"),
      },
    },
    define: {
      API_BASE_URL: JSON.stringify(env.API_BASE_URL),
    },
  };
});
