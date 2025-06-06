// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // optimizeDeps: {
    //   include: ['@total-report/core-contract']
    // }
  },

  integrations: [react()]
});