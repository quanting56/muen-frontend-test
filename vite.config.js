import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  base: "/muen-exam-frontend/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")  // 加這一行，引入@開頭的路徑就可以正常解析
    }
  },
});
