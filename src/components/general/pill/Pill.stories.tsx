import type { Meta, StoryObj } from '@storybook/react';
import Pill, { PillProps } from './Pill';

const meta: Meta<PillProps> = {
  title: 'Components/General/Pills',
  component: Pill,
  argTypes: {},
} as Meta;

export default meta;

export const Primary: StoryObj<PillProps> = {
  render: () => {
    return (
      <Pill
        variant={"primary"}
        text={"Primary"}
      />
    )
  },
  argTypes: {},
};

export const Secondary: StoryObj<PillProps> = {
  render: () => {
    return (
      <Pill
        variant={"secondary"}
        text={"Secondary"}
      />
    )
  },
  argTypes: {},
};

export const Success: StoryObj<PillProps> = {
  render: () => {
    return (
      <Pill
        variant={"success"}
        text={"Success"}
      />
    )
  },
  argTypes: {},
};

export const Warning: StoryObj<PillProps> = {
  render: () => {
    return (
      <Pill
        variant={"warning"}
        text={"Warning"}
      />
    )
  },
  argTypes: {},
};

export const Danger: StoryObj<PillProps> = {
  render: () => {
    return (
      <Pill
        variant={"danger"}
        text={"Danger"}
      />
    )
  },
  argTypes: {},
};
