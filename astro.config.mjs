// @ts-check
import { defineConfig, envField } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      PUBLIC_MEDUSA_BACKEND_URL: envField.string({ context: "client", access: "public", optional: true }),
      PUBLIC_MEDUSA_PUBLISHABLE_KEY: envField.string({ context: "client", access: "public", optional: true }),
    }
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  },
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@medusajs/js-sdk']
    }
  }
});