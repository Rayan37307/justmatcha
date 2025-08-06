import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/coverage/**',
        '**/*.d.ts',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{vite,vitest,postcss,babel}.config.{js,cjs,ts}'
      ]
    },
    reporters: ['default', 'junit'],
    outputFile: 'test-results/junit.xml',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
