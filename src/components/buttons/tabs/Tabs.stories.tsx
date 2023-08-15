import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import Tabs, { TabsProps } from './Tabs';
import { useState } from 'react';

const meta: Meta<TabsProps> = {
  title: 'Components/Buttons/Tabs/Tabs Only',
  component: Tabs,
  argTypes: {
  },
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      expanded: true,
    },
    backgrounds: {
      disable: true,
    }
  },
  decorators: [
    (Story: StoryFn) => (
      <div className="story__decorator" style={{
        padding: '48px 24px',
        backgroundColor: 'var(--token-dark-200)',
        margin: '-20px -10px',
        borderRadius: '8px',
        fontSize: 'var(--token-font-size-small)'
      }}>
        <Story />
      </div>
    ),
  ],
} as Meta;

export default meta;

const TabsComponent = () => {
  const [activeTabKey, setActiveTabKey] = useState('tab1');

  return (
    <Tabs
      activeTabKey={activeTabKey}
      tabs={[
        {
          key: 'tab1',
          tabLabel: 'Tab 1',
          onClick: () => setActiveTabKey('tab1'),
        },
        {
          key: 'tab2',
          tabLabel: 'Tab 2',
          onClick: () => setActiveTabKey('tab2'),
        },
        {
          key: 'tab3',
          tabLabel: 'Tab 3',
          onClick: () => setActiveTabKey('tab3'),
        },
      ]}
    />
  );
}

export const Default: StoryObj<TabsProps> = {
  render: () => (
    <TabsComponent />
  )
};
