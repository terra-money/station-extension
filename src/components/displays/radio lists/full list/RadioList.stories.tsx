/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import RadioList, { RadioListProps } from './RadioList';
import { useState } from 'react';
import RadioListItem from '../item/RadioListItem';

import { options, subOptions } from '../mockData';

const meta: Meta<RadioListProps> = {
  title: 'Components/Displays/Radio Lists/Full List',
  component: RadioList,
  argTypes: {},
} as Meta;

export default meta;

export const NoAccordion: StoryObj<RadioListProps> = {
  render: () => {
    const [checked, setChecked] = useState<number>(0);

    return (
      <RadioList>
        <RadioListItem
          label='Radio Option'
          checked={checked === 0}
          onClick={() => setChecked(0)}
        />
        <RadioListItem
          label='Radio Option'
          checked={checked === 1}
          onClick={() => setChecked(1)}
        />
        <RadioListItem
          label='Radio Option'
          checked={checked === 2}
          onClick={() => setChecked(2)}
        />
        <RadioListItem
          label='Radio Option'
          checked={checked === 3}
          onClick={() => setChecked(3)}
        />
      </RadioList>
    )
  },
  argTypes: {},
};

export const WithAccordion: StoryObj<RadioListProps> = {
  render: () => {
    const [checked, setChecked] = useState<number>(0);
    const [openIndex, setOpenIndex] = useState<number>(-1);

    return (
      <div style={{ width: '342px' }}>
        <RadioList>
          {options.map(({ value, label }: { value: string, label: string }, index: number) => (
            <RadioListItem
              key={value}
              label={label}
              checked={checked === index}
              onClick={() => setChecked(index)}
              isOpen={openIndex === index}
              setOpenAcc={openIndex === index ? () => setOpenIndex(-1) : () => setOpenIndex(index)}
              accContent={subOptions[value]}
            />
          ))}
        </RadioList>
      </div>
    )
  },
  argTypes: {},
};
