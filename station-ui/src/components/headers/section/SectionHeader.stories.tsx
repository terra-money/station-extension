import type { Meta, StoryObj } from '@storybook/react';
import SectionHeader, { SectionHeaderProps } from './SectionHeader';
import { ReactComponent as FilterIcon } from 'assets/icon/Filter.svg';

const meta: Meta<SectionHeaderProps> = {
  title: 'Components/Headers/Section/Stories',
  component: SectionHeader,
  argTypes: {},
} as Meta;

export default meta;

export const TitleOnly: StoryObj<SectionHeaderProps> = {
  render: () => {
    return (
      <SectionHeader
        title="Swap"
        indented={false}
      />
    );
  },
};

export const TitleWithAction: StoryObj<SectionHeaderProps> = {
  render: () => {
    return (
      <SectionHeader
        title="Swap"
        extra={<FilterIcon fill='var(--token-dark-900)' />}
      />
    );
  },
};

export const TitleWithLine: StoryObj<SectionHeaderProps> = {
  render: () => {
    return (
      <SectionHeader
        title="Swap"
        withLine
      />
    );
  },
};

export const TitleIndented: StoryObj<SectionHeaderProps> = {
  render: () => {
    return (
      <SectionHeader
        title="Swap"
        indented
      />
    );
  },
};

export const TitleWithIcon: StoryObj<SectionHeaderProps> = {
  render: () => {
    return (
      <SectionHeader
        title="Swap"
        indented
        icon={<div style={{ borderRadius: '50%', backgroundColor: 'var(--token-primary-500)', width: '8px', height: '8px' }} />}
      />
    );
  },
};

export const TitleWithArrow: StoryObj<SectionHeaderProps> = {
  render: () => {
    return (
      <SectionHeader
        title="Show Low Balance Assets (2)"
        withArrow
        withLine
        onClick={() => console.log('clicked')}
      />
    );
  },
};

export const JustALine: StoryObj<SectionHeaderProps> = {
  render: () => {
    return (
      <SectionHeader
        title=""
        withLine
      />
    );
  },
};

