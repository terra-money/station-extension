import React from 'react';
import { SvgProps } from 'react-native-svg';
import {
    ActivityNavigationIcon,
    ArrowDownIcon,
    GovNavigationIcon,
    HistoryNavigationIcon,
    StakingNavigationIcon,
    SwapNavigationIcon,
    WalletNavigationIcon,
} from '../../icons';
import { AppStackParamList } from '../../routes/types';

interface NavigationIconProps {
    type: keyof AppStackParamList;
    fill: string;
}

const icons = {
    Wallet: (props: SvgProps) => <WalletNavigationIcon {...props} />,
    Activity: (props: SvgProps) => <ActivityNavigationIcon {...props} />,
    Staking: (props: SvgProps) => <StakingNavigationIcon {...props} />,
    Governance: (props: SvgProps) => <GovNavigationIcon {...props} />,
    History: (props: SvgProps) => <HistoryNavigationIcon {...props} />,
    Send: (props: SvgProps) => <ArrowDownIcon {...props} />,
};

const NavigationIconComponent = ({ type, fill }: NavigationIconProps) => {
    if (icons[type]) {
        const Component = icons[type];
        return <Component fill={fill} />;
    }
    return null;
};

export const NavigationIcon = React.memo(NavigationIconComponent);
