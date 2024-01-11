/* eslint-disable react-hooks/rules-of-hooks */
import type { Meta, StoryObj } from '@storybook/react';
import Form, { FormProps } from './Form';
import { InputWrapper } from '../index';
import { Input } from 'components/inputs';
import { useForm } from 'react-hook-form';
import { FlexColumn, SubmitButton } from 'components';

const meta: Meta<FormProps> = {
  title: 'Components/Form/Stories',
  component: Form,
} as Meta;

export default meta;

export const FullFormExample: StoryObj<FormProps> = {
  render: () => {
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const onSubmit = handleSubmit(data => console.log(data));

    return (
      <div style={{ height: "500px", border: "2px solid #ff00004a", position: "relative" }}>
        <div style={{ marginTop: "-20px", color: "#ff00004a", position: "absolute", top: "0px", left: "0" }}>Border shows Storybook container</div>
        <Form onSubmit={onSubmit} spaceBetween fullHeight>
          <FlexColumn gap={24}>
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
          </FlexColumn>
          <SubmitButton type='submit'>Submit</SubmitButton>
        </Form>
      </div>
    )
  },
};

export const NoProps: StoryObj<FormProps> = {
  render: () => {
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const onSubmit = handleSubmit(data => console.log(data));

    return (
      <div style={{ height: "500px", border: "2px solid #ff00004a", position: "relative" }}>
        <div style={{ marginTop: "-20px", color: "#ff00004a", position: "absolute", top: "0px", left: "0" }}>Border shows Storybook container</div>
        <Form onSubmit={onSubmit}>
          <FlexColumn gap={24}>
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
          </FlexColumn>
          <SubmitButton type='submit'>Submit</SubmitButton>
        </Form>
      </div>
    )
  },
};

export const WithSpaceBetweenAndFullHeight: StoryObj<FormProps> = {
  render: () => {
    const { register, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const onSubmit = handleSubmit(data => console.log(data));

    return (
      <div style={{ height: "500px", border: "2px solid #ff00004a", position: "relative" }}>
        <div style={{ marginTop: "-20px", color: "#ff00004a", position: "absolute", top: "0px", left: "0" }}>Border shows Storybook container</div>
        <Form onSubmit={onSubmit} spaceBetween fullHeight>
          <FlexColumn gap={24}>
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
          </FlexColumn>
          <SubmitButton type='submit'>Submit</SubmitButton>
        </Form>
      </div>
    )
  },
};
