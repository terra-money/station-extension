/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import SendAmount, { SendAmountProps } from './SendAmount';
import { tokensBySymbol, tokenPrices } from '../assetselector/fakedata';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const meta: Meta<SendAmountProps> = {
  title: 'Components/Inputs/Send Amount/Stories',
  component: SendAmount,
  argTypes: {},
} as Meta;

export default meta;

export const TokenLarge: StoryObj<SendAmountProps> = {
  render: () => {
    const [sendToken, ] = useState('LUNA');
    const { register, handleSubmit, watch } = useForm();
    const onSubmit = handleSubmit(data => console.log(data));

    return (
      <form onSubmit={onSubmit}>
        <SendAmount
          displayType={'token'}
          symbol={sendToken}
          tokenIcon={tokensBySymbol[sendToken].tokenIcon}
          amountInputAttrs={{...register("inputAmount", { required: true, valueAsNumber: true })}}
          amount={watch("inputAmount") || 0}
          secondaryAmount={watch("inputAmount") || 0}
          currencySymbol={'$'}
          price={tokenPrices[sendToken]}
        />
      </form>
    )
  },
};

export const ValueLarge: StoryObj<SendAmountProps> = {
  render: () => {
    const [sendToken, ] = useState('LUNA');
    const { register, handleSubmit, watch } = useForm();
    const onSubmit = handleSubmit(data => console.log(data));

    return (
      <form onSubmit={onSubmit}>
        <SendAmount
          displayType={'currency'}
          symbol={sendToken}
          tokenIcon={tokensBySymbol[sendToken].tokenIcon}
          amountInputAttrs={{...register("inputAmount", { required: true, valueAsNumber: true })}}
          amount={watch("inputAmount") || 0}
          secondaryAmount={watch("inputAmount") || 0}
          currencySymbol={'$'}
          price={tokenPrices[sendToken]}
        />
      </form>
    )
  },
};