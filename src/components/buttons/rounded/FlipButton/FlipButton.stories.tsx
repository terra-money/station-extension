import type { Meta, StoryObj } from '@storybook/react';
import FlipButton, { FlipButtonProps } from './FlipButton';

const meta: Meta<FlipButtonProps> = {
  title: 'Components/Buttons/Rounded/FlipButton',
  component: FlipButton,
  argTypes: {
    onClick: {
      description: 'A function passed in to control what happens when the button is clicked.'
    }
  },
} as Meta;

export default meta;

export const Button: StoryObj = {
  render: () =>
    <FlipButton
      onClick={() => console.log('flip')}
    />,
};
