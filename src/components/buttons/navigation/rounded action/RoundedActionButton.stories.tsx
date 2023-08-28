import type { Meta, StoryObj } from '@storybook/react';
import { Decorator } from "DocsHelpers"
import { DEFAULT_PARAMS } from 'Constants';
import RoundedActionButton from './RoundedActionButton';

const meta: Meta = {
  title: 'Components/Buttons/Navigation/Rounded Action',
  component: RoundedActionButton,
  parameters: { ...DEFAULT_PARAMS },
  decorators: [Decorator],

} as Meta;

export default meta;

export const Default: StoryObj = {
  render: () => <RoundedActionButton />,
};
