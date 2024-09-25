import zlib from "zlib";
import { defineConfig, loadEnv } from 'vite';
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
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: isProduction ? PRODUCTION_PLUGINS : [react()],
    base: isProduction ? "/memcrab-test-task/" : "/",
    define: {
      "process.env": JSON.stringify(env),
    },
    server: {
      host: true,
      port: 3000,
    },
  });
};