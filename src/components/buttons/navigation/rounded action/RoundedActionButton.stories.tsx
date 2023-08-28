import type { Meta, StoryObj } from '@storybook/react';
import RoundedActionButton from './RoundedActionButton';

const meta: Meta = {
  title: 'Components/Buttons/Navigation/Rounded Action',
  component: RoundedActionButton,
} as Meta;

export default meta;

export const Default: StoryObj = {
  render: () => <RoundedActionButton />,
};
