/// <reference types="vitest" />
import { defineConfig } from 'vite';
import { getViteConfig } from 'astro/config';

export default defineConfig(
  getViteConfig({
    // @ts-ignore - vitest extends vite config
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/test/setup.ts',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.d.ts',
          '**/*.config.*',
          '**/.{eslint,mocha,prettier}rc.{js,cjs,yml}',
        ],
      },
    },
  })
);