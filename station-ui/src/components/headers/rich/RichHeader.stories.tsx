import type { Meta, StoryObj } from '@storybook/react';
import RichHeader, { RichHeaderProps } from './RichHeader';

const meta: Meta<RichHeaderProps> = {
  title: 'Components/Headers/Rich/Stories',
  component: RichHeader,
  argTypes: {},
} as Meta;

export default meta;

export const Default: StoryObj<RichHeaderProps> = {
  render: () => {
    return (
      <RichHeader
        image={"https://raw.githubusercontent.com/terra-money/validator-images/main/images/A2879F08F59FB0AF.jpg"}
        title={"Orbital Command"}
        link={"https://orbitalcommand.io"}
        description={"Secure, enterprise-grade validator. Committed to investing heavily into educating, promoting, and expanding the Terra community and ecosystem. Delegate to OC to eliminate slashing risk, earn more $LUNA, and support $LUNA price appreciation through community growth."}
      />
    );
  },
};

export const WithCheckIcon: StoryObj<RichHeaderProps> = {
  render: () => {
    return (
      <RichHeader
        image={"https://raw.githubusercontent.com/terra-money/validator-images/main/images/A2879F08F59FB0AF.jpg"}
        title={"Orbital Command"}
        link={"https://orbitalcommand.io"}
        description={"Secure, enterprise-grade validator. Committed to investing heavily into educating, promoting, and expanding the Terra community and ecosystem. Delegate to OC to eliminate slashing risk, earn more $LUNA, and support $LUNA price appreciation through community growth."}
        status={"check"}
      />
    );
  },
};

export const WithAlertIcon: StoryObj<RichHeaderProps> = {
  render: () => {
    return (
      <RichHeader
        image={"https://raw.githubusercontent.com/terra-money/validator-images/main/images/A2879F08F59FB0AF.jpg"}
        title={"Orbital Command"}
        link={"https://orbitalcommand.io"}
        description={"Secure, enterprise-grade validator. Committed to investing heavily into educating, promoting, and expanding the Terra community and ecosystem. Delegate to OC to eliminate slashing risk, earn more $LUNA, and support $LUNA price appreciation through community growth."}
        status={"alert"}
      />
    );
  },
};

export const NoDescription: StoryObj<RichHeaderProps> = {
  render: () => {
    return (
      <RichHeader
        image={"https://raw.githubusercontent.com/terra-money/validator-images/main/images/A2879F08F59FB0AF.jpg"}
        title={"Orbital Command"}
        link={"https://orbitalcommand.io"}
      />
    );
  },
};
