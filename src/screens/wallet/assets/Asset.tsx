import { Text } from 'components';
import React from 'react';
import { SvgUri } from 'react-native-svg';
import { TrendingUpIcon, TrendingDownIcon } from 'icons';
import { useTheme } from 'styled-components';

import * as S from './Assets.styled';
import { useExchangeRates, useNativeDenoms } from 'utils';

interface AssetComponent {
    icon: string;
    symbol: string;
    change: number;
    balance: number;
    amount: string;
    price: number;
    onPress: () => void;
    denom?: string;
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

const AssetComponent = ({ icon, symbol, change, balance, amount, price, denom = 'uluna', onPress }: AssetComponent) => {
    const theme = useTheme();
    const readNativeDenom = useNativeDenoms();
    const { token, icon: denomIcon, decimals } = readNativeDenom(denom);

    // (prices?.[token]?.price || 0) * parseInt(balance)
    const { data: prices, ...pricesState } = useExchangeRates();

    const assetPrice = price
        ? price * parseInt(balance / 1000000 ?? '0')
        : (prices?.[token]?.price || 0) * parseInt(balance / 1000000);

    return (
        <S.AssetContainer onPress={onPress}>
            <S.IconContainer>
                <SvgUri width="26px" height="26px" uri={icon || denomIcon} />
            </S.IconContainer>
            <S.AssetInfo>
                <Text.Body>{symbol}</Text.Body>
                {change ? <Trend trend={change.toFixed(2)} /> : null}
            </S.AssetInfo>
            <S.AssetValue>
                <Text.BodySmallBold>{`$ ${assetPrice ? assetPrice.toFixed(2) : 0}`}</Text.BodySmallBold>
                <Text.BodySmallBold color={theme.palette.text.muted}>{`${
                    balance ? balance / 1000000 : 0
                } ${symbol}`}</Text.BodySmallBold>
            </S.AssetValue>
        </S.AssetContainer>
    );
};

export const Asset = React.memo(AssetComponent);
