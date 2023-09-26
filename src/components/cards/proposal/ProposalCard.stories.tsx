import type { Meta, StoryObj } from '@storybook/react';
import ProposalCard, { ProposalCardProps } from './ProposalCard';

const meta: Meta<ProposalCardProps> = {
  title: 'Components/Cards/Proposal',
  component: ProposalCard,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<ProposalCardProps> = {
  render: () => {
    return (
      <ProposalCard
        proposal={{
          metaText: "4736 | Community pool spend proposal",
          metaImage: "https://station-assets.terra.dev/img/chains/Terra.svg",
          title: "OFFICIAL “Revitalizing Terra: A Backbone Labs and Eris Protocol Collaboration” (Not A Grant)",
          submittedDate: "3 July 2023, 18:49:03 UTC",
        }}
        progressData={[
          { type: 'yes', percent: '5%' },
          { type: 'abstain', percent: '10%' },
          { type: 'no', percent: '2%' },
          { type: 'noWithVeto', percent: '0.5%' },
        ]}
        threshold={50}
        progressLabelOverride={'PT'}
      />
    )
  },
  argTypes: {},
};

export const Deposit: StoryObj<ProposalCardProps> = {
  render: () => {
    return (
      <ProposalCard
        proposal={{
          metaText: "4740 | Text proposal",
          metaImage: "https://station-assets.terra.dev/img/chains/Terra.svg",
          title: "LUNA NOW!",
          submittedDate: "28 July 2023, 13:52:11 UTC",
        }}
        progressData={[
          { type: 'deposit', percent: '65%' },
        ]}
        threshold={65}
        progressLabelOverride={'65%'}
      />
    )
  },
  argTypes: {},
};