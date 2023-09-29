import { Meta, StoryObj } from '@storybook/react';
import Banner, { BannerProps } from './Banner';

const meta: Meta<BannerProps> = {
  title: 'Components/Displays/Banners/Default',
  component: Banner,
  argTypes: {},
} as Meta;

export default meta;

export const Info: StoryObj<BannerProps> = {
  render: () => (
    <Banner variant='info' title='This is an Info Banner' />
  ),
};

export const Success: StoryObj<BannerProps> = {
  render: () => (
    <Banner variant='success' title='This is an Success Banner' />
  ),
};

export const Warning: StoryObj<BannerProps> = {
  render: () => (
    <Banner variant='warning' title='This is an Warning Banner' />
  ),
};

export const Error: StoryObj<BannerProps> = {
  render: () => (
    <Banner variant='error' title='This is an Error Banner' />
  ),
};


export const TextWrapExample: StoryObj<BannerProps> = {
  render: () => (
    <Banner variant='error' title='This action can not be undone. You will need a private key or a mnemonic seed phrase to restore this wallet to the app.' />
  ),
};