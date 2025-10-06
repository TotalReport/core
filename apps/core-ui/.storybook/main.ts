import type { StorybookConfig } from "storybook-react-rsbuild";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["storybook-addon-modernjs", "msw-storybook-addon"],
  staticDirs: ["../public"],
  framework: "storybook-react-rsbuild",
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  rsbuildFinal: async (config) => {
    // Manually ensure Tailwind CSS is processed
    config.tools = config.tools || {};
    config.tools.postcss = {
      postcssOptions: {
        plugins: [require("tailwindcss"), require("autoprefixer")],
      },
    };
    return config;
  },
};
export default config;
