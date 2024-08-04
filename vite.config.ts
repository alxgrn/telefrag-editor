import { defineConfig } from "vite"
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.build.json",
    }),
  ],
  build: {
    sourcemap: true,
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "TelefragEditor",
      formats: ["es", "umd"],
      fileName: (format) => `telefrag-editor.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@alxgrn/react-form"],
      output: {
        globals: {
          "react": "React",
          "react-dom": "ReactDOM",
          "@alxgrn/react-form": "@alxgrn/react-form",
        },
      },
    },
  },
});
