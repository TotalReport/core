import type { StorybookConfig } from 'storybook-react-rsbuild'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['storybook-addon-modernjs'],
  framework: 'storybook-react-rsbuild',
  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
}
export default config
