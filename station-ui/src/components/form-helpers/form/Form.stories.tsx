/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import Form from './Form';
import { InputWrapper } from '../index';
import { Input } from 'components/inputs';
import { useForm } from 'react-hook-form';
import { SubmitButton } from 'components';

const meta: Meta = {
  title: 'Components/Form/Stories',
  component: Form,
} as Meta;

export default meta;

export const FullFormExample: StoryObj = {
  render: () => {
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const onSubmit = handleSubmit(data => console.log(data));

    return (
      <Form onSubmit={onSubmit}>
        <InputWrapper label='First Name' error={errors?.first?.message as string | undefined}>
          <Input
            placeholder='Name'
            {...register('first', {
              required: true,
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Entered value does not match email format",
              },
            })}
          />
        </InputWrapper>
        <InputWrapper label='Last Name' error={errors?.last?.message as string | undefined}>
          <Input
            placeholder='Name'
            {...register('last', { required: true })}
          />
        </InputWrapper>
        <SubmitButton type='submit'>Submit</SubmitButton>
      </Form>
    )
  },
};
