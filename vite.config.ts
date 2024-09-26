import zlib from "zlib";
import path from "path";

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from "vite-plugin-compression";

const PRODUCTION_PLUGINS = [
  react(),
  viteCompression({
    algorithm: "brotliCompress",
    ext: ".br",
    compressionOptions: {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    },
    threshold: 10240,
  }),
]

export default ({ mode }: any) => {
  const isProduction = mode === "production";

  return defineConfig({
    plugins: isProduction ? PRODUCTION_PLUGINS : [react()],
    base: isProduction ? "/memcrab-test-task/" : "/",
    root: path.join(__dirname, "/"),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
        "@app": path.resolve(__dirname, "./src/app/"),
        "@components": path.resolve(__dirname, "./src/app/components/"),
        "@views": path.resolve(__dirname, "./src/app/views/"),
        "@utils": path.resolve(__dirname, "./src/app/utils/"),
        "@static": path.resolve(__dirname, "./src/app/static/"),
        jsbi: path.resolve(__dirname, "./node_modules/jsbi/dist/jsbi-cjs.js"),
      },
    },
    server: {
      host: true,
      port: 3000,
    },
  });
};