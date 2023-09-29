import type { Meta, StoryObj } from '@storybook/react';
import { ReactComponent as GovernanceIcon } from 'assets/icon/Governance.svg';
import PageHeader, { PageHeaderProps } from './PageHeader';

const meta: Meta<PageHeaderProps> = {
  title: 'Components/Headers/PageHeader/Stories',
  component: PageHeader,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<PageHeaderProps> = {
  render: () => {
    return (
      <PageHeader
        title="Governance"
        description="Browse and vote on governance proposals across the Cosmos ecosystem."
        icon={<GovernanceIcon fill="var(--token-dark-900)" />}
      />
    );
  },
};
