import type { Meta, StoryObj } from '@storybook/react';
import { EditableNumber } from './editable-number.jsx';

const meta = {
  title: 'UI/EditableNumber',
  component: EditableNumber,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An editable number component that displays a whole number and allows inline editing when clicked. All inputs are automatically rounded to integers.',
      },
    },
  },
  argTypes: {
    value: {
      control: { type: 'number' },
      description: 'The current number value (always rounded to whole numbers)',
    },
    onSubmit: {
      action: 'submitted',
      description: 'Callback fired when the value is submitted',
    },
    min: {
      control: { type: 'number' },
      description: 'Minimum allowed value',
    },
    max: {
      control: { type: 'number' },
      description: 'Maximum allowed value',
    },
  },
  args: {
    onSubmit: (newValue: number) => {
      console.log('Value submitted:', newValue);
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EditableNumber>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default state of the editable number component.
 */
export const Default: Story = {
  args: {
    value: 42,
  },
};

/**
 * Component with a very small number to test display.
 */
export const SmallNumber: Story = {
  args: {
    value: 1,
  },
};

/**
 * Component with a large number to test display width.
 */
export const LargeNumber: Story = {
  args: {
    value: 999999,
  },
};

/**
 * Component with a negative number.
 */
export const NegativeNumber: Story = {
  args: {
    value: -123,
  },
};

/**
 * Component with zero value.
 */
export const Zero: Story = {
  args: {
    value: 0,
  },
};

/**
 * Component with minimum value constraint.
 */
export const WithMinimum: Story = {
  args: {
    value: 5,
    min: 0,
  },
  parameters: {
    docs: {
      description: {
        story: 'The component enforces a minimum value of 0. Try editing to a negative number.',
      },
    },
  },
};

/**
 * Component with maximum value constraint.
 */
export const WithMaximum: Story = {
  args: {
    value: 50,
    max: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'The component enforces a maximum value of 100. Try editing to a number above 100.',
      },
    },
  },
};

/**
 * Component with both minimum and maximum constraints.
 */
export const WithRange: Story = {
  args: {
    value: 25,
    min: 1,
    max: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'The component enforces a range between 1 and 100.',
      },
    },
  },
};

/**
 * Component in disabled state (when min equals max).
 */
export const Disabled: Story = {
  args: {
    value: 42,
    min: 42,
    max: 42,
  },
  parameters: {
    docs: {
      description: {
        story: 'When min and max are equal, the component becomes disabled and non-editable.',
      },
    },
  },
};

/**
 * Component at minimum boundary.
 */
export const AtMinimumBoundary: Story = {
  args: {
    value: 0,
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Value is at the minimum boundary.',
      },
    },
  },
};

/**
 * Component at maximum boundary.
 */
export const AtMaximumBoundary: Story = {
  args: {
    value: 100,
    min: 0,
    max: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Value is at the maximum boundary.',
      },
    },
  },
};

/**
 * Component with tight range (testing edge case).
 */
export const TightRange: Story = {
  args: {
    value: 1,
    min: 1,
    max: 2,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component with a very tight range between 1 and 2.',
      },
    },
  },
};

/**
 * Component that only accepts whole numbers.
 */
export const IntegerOnly: Story = {
  args: {
    value: 42,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component always accepts only whole numbers. Decimal inputs will be automatically rounded.',
      },
    },
  },
};

/**
 * Component with range constraints (integers only).
 */
export const IntegerOnlyWithRange: Story = {
  args: {
    value: 50,
    min: 1,
    max: 100,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component that only accepts whole numbers between 1 and 100.',
      },
    },
  },
};

/**
 * Component with step behavior for integers.
 */
export const IntegerStepping: Story = {
  args: {
    value: 10,
  },
  parameters: {
    docs: {
      description: {
        story: 'Component with integer stepping. Use browser arrow controls to increment/decrement by 1.',
      },
    },
  },
};
