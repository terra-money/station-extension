import type { Meta, StoryObj } from '@storybook/react';
import { Decorator } from "DocsHelpers"
import { DEFAULT_PARAMS } from 'Constants';
import FlipButton, { FlipButtonProps } from './FlipButton';

const meta: Meta<FlipButtonProps> = {
  title: 'Components/Buttons/Rounded/FlipButton',
  component: FlipButton,
  argTypes: {
    onClick: {
      description: 'A function passed in to control what happens when the button is clicked.'
    }
  },
  parameters: { ...DEFAULT_PARAMS },
  decorators: [Decorator],

} as Meta;

export default meta;

export const Button: StoryObj = {
  render: () =>
    <FlipButton
      onClick={() => console.log('flip')}
    />,
};
