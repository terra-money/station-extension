import { Meta, StoryObj } from '@storybook/react';
import TopLevelBanner, { TopLevelBannerProps } from './TopLevelBanner';

const meta: Meta<TopLevelBannerProps> = {
  title: 'Components/Displays/Banners/Top Level',
  component: TopLevelBanner,
  argTypes: {},
} as Meta;

export default meta;

export const Info: StoryObj<TopLevelBannerProps> = {
  render: () => (
    <TopLevelBanner
      variant='info'
      title='This is an Info Banner'
      withRadio={true}
      onRadioClick={() => console.log('clicked')}
    />
  ),
};

export const Warning: StoryObj<TopLevelBannerProps> = {
  render: () => (
    <TopLevelBanner variant='warning' title='This is an Warning Banner' />
  ),
};

export const TextWrapExample: StoryObj<TopLevelBannerProps> = {
  render: () => (
    <TopLevelBanner variant='info' title='This action can not be undone. You will need a private key or a mnemonic seed phrase to restore this wallet to the app.' />
  ),
};
