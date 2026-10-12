import { defineConfig } from 'vite';

export default defineConfig({
  // 相对路径基址：构建产物可在任意子路径/静态托管下直接部署
  base: './',
  server: {
    host: true,
    open: true,
  },
  build: {
    target: 'es2022',
    sourcemap: true,
  },
});
