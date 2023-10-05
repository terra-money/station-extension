import type { Meta, StoryObj } from '@storybook/react';
import SwapSummary, { SwapSummaryProps } from './SwapSummary';

const meta: Meta<SwapSummaryProps> = {
  title: 'Components/Displays/Swap Summary/Stories',
  component: SwapSummary,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<SwapSummaryProps> = {
  render: () => (
    <SwapSummary
      fromAsset={{
        symbol: 'KUJI',
        amount: '1000',
        icon: 'https://station-assets.terra.dev/img/coins/Kuji.svg',
      }}
      toAsset={{
        symbol: 'LUNA',
        amount: '0.0015',
        icon: 'https://station-assets.terra.dev/img/coins/Luna.svg',
      }}
    />
  ),
};
