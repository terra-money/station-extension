import type { Meta, StoryObj } from '@storybook/react';
import ProposalHeader, { ProposalHeaderProps } from './ProposalHeader';

const meta: Meta<ProposalHeaderProps> = {
  title: 'Components/Headers/ProposalHeader/Stories',
  component: ProposalHeader,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<ProposalHeaderProps> = {
  render: () => {
    return (
      <ProposalHeader
        metaText={"4736 | Community pool spend proposal"}
        metaImage={"https://station-assets.terra.dev/img/chains/Terra.svg"}
        title={"OFFICIAL “Revitalizing Terra: A Backbone Labs and Eris Protocol Collaboration” (Not A Grant)"}
        submittedDate={"3 July 2023, 18:49:03 UTC"}
      />
    );
  },
};
