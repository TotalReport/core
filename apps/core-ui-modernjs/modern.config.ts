import { appTools, defineConfig } from '@modern-js/app-tools';
import { tailwindcssPlugin } from '@modern-js/plugin-tailwindcss';

// https://modernjs.dev/en/configure/app/usage
export default defineConfig({
  source: {
    globalVars: {
      "process.env.CORE_SERVICE_BASE_URL": process.env.CORE_SERVICE_BASE_URL,
    }
  },
  runtime: {
    router: true,
  },
  plugins: [
    appTools({
      bundler: 'rspack', // Set to 'webpack' to enable webpack
    }),
    tailwindcssPlugin(),
  ],
});
