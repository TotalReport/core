import type { Meta, StoryObj } from '@storybook/react';
import { EditableNumber } from './editable-number.jsx';

const meta = {
  component: EditableNumber,
} satisfies Meta<typeof EditableNumber>;

export default meta;
type Story = StoryObj<typeof meta>;
 
export const Primary: Story = {
  args: {
    value: 10,
    onSubmit: (newValue: number) => {
      console.log('New value submitted:', newValue);
    }
  },
};
