import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RadioListItem, { RadioListItemProps } from './RadioListItem';
import { subOptions } from '../mockData';

const meta: Meta<RadioListItemProps> = {
  title: 'Components/Displays/Radio Lists/Item',
  component: RadioListItem,
  argTypes: {},
} as Meta;

export default meta;

const HelperFunction = () => {
  const [checked, setChecked] = useState<boolean>(false);

  return (
    <RadioListItem
      label='Radio Option'
      checked={checked}
      onClick={() => setChecked(!checked)}
    />
  );
};

const AccHelperFunction = () => {
  const [checked, setChecked] = useState<boolean>(false);
  const [openAcc, setOpenAcc] = useState<boolean>(false);

  return (
    <RadioListItem
      label='Radio Option'
      checked={checked}
      onClick={() => setChecked(!checked)}
      isOpen={openAcc}
      setOpenAcc={setOpenAcc}
      accContent={subOptions['option1']}
    />
  );
};

export const Default: StoryObj<RadioListItemProps> = {
  render: () => {
    return (
      <HelperFunction />
    )
  },
  argTypes: {},
};

export const Accordion: StoryObj<RadioListItemProps> = {
  render: () => {
    return (
      <AccHelperFunction />
    )
  },
  argTypes: {},
};
