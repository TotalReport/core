import type { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import '../src/styles/globals.css';

// Initialize MSW
initialize();

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: 'hsl(0 0% 100%)',
        },
        {
          name: 'dark',
          value: 'hsl(0 0% 3.9%)',
        },
      ],
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => React.createElement(
      'div',
      { className: 'font-sans antialiased' },
      React.createElement(Story)
    ),
  ],
  tags: ['autodocs'],
};

export default preview;
