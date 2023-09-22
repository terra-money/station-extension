import type { Meta, StoryObj } from '@storybook/react';
import SendHeader, { SendHeaderProps } from './SendHeader';

const meta: Meta<SendHeaderProps> = {
  title: 'Components/Headers/SendHeader/Stories',
  component: SendHeader,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<SendHeaderProps> = {
  render: () => {
    return (
      <SendHeader
        heading="Sending"
        label="5 LUNA"
        subLabel="$3.65"
      />
    );
  },
};
