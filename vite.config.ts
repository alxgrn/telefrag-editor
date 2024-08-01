import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "src/lib/index.ts"),
      name: "TelefragEditor",
      formats: ["es", "umd"],
      fileName: (format) => `telefrag-editor.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "quill", "@alxgrn/react-form", "highlight.js"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          quill: "Quill",
          "highlight.js": "hljs",
          "@alxgrn/react-form": "ReactForm",
        },
      },
    },
  },
});
