import { Text } from 'components';
import React from 'react';
import { SvgUri } from 'react-native-svg';
import { TrendingUpIcon, TrendingDownIcon } from '../../../icons';
import { useTheme } from 'styled-components';

import * as S from './Assets.styled';

interface AssetComponent {
    iconUri: string;
    name: string;
    trend: number;
    value: string;
    amount: string;
}

const Trend = ({ trend }: { trend: number }) => {
    const theme = useTheme();
    const positive = trend >= 0;
    const color = positive ? theme.palette.extra.info : theme.palette.extra.danger;

    const Icon = positive ? TrendingUpIcon : TrendingDownIcon;

    return (
        <S.AssetTrend>
            <Icon fill={color} />
            <Text.BodySmallBold color={color}>{`${positive ? '+' : ''}${trend}%`}</Text.BodySmallBold>
        </S.AssetTrend>
    );
};

const AssetComponent = ({ iconUri, name, trend, value, amount }: AssetComponent) => {
    const theme = useTheme();
    return (
        <S.AssetContainer>
            <S.IconContainer>
                <SvgUri width="26px" height="26px" uri={iconUri} />
            </S.IconContainer>
            <S.AssetInfo>
                <Text.Body>{name}</Text.Body>
                <Trend trend={trend} />
            </S.AssetInfo>
            <S.AssetValue>
                <Text.BodySmallBold>{value}</Text.BodySmallBold>
                <Text.BodySmallBold color={theme.palette.text.muted}>{amount}</Text.BodySmallBold>
            </S.AssetValue>
        </S.AssetContainer>
    );
};

export const Asset = React.memo(AssetComponent);
