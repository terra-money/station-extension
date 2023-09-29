import React from 'react';
import { useTheme } from 'styled-components';
import { SvgUri } from 'react-native-svg';

import { NavigationTop, Text, CircleButton } from 'components';
import { PortfolioSendIcon, PlusIcon, PortfolioReceiveIcon } from 'icons';

import { Asset } from '../assets/Asset';
import * as AS from './AssetDetails.styled';
import * as S from '../portfolio/PortfolioHeader.styled';
import { useBankBalance, useExchangeRates, useNativeDenoms } from 'utils';

const AssetDetailsComponent = ({ navigation, route }) => {
    const theme = useTheme();
    const {
        params: { asset },
    } = route;

    const { icon, symbol, change, balance, amount, price } = asset;
    const assetPrice = price * parseInt(balance / 1000000 ?? '0');

    const { data: prices } = useExchangeRates();
    const balances = useBankBalance();
    const readNativeDenom = useNativeDenoms();

    const { token } = readNativeDenom(asset.denom);

    const filteredBalances = balances.filter(b => readNativeDenom(b.denom).token === token);
    console.log('filteredBalances', filteredBalances);

    return (
        <>
            <NavigationTop navigation={navigation} />
            <S.BorderLine />
            <S.Container>
                <AS.IconContainer>
                    <SvgUri width="26px" height="26px" uri={icon} />
                </AS.IconContainer>
                <Text.Title3>{`${balance ? balance / 1000000 : 0} ${symbol}`}</Text.Title3>
                <Text.Label color={theme.palette.dark900}>{`$ ${
                    assetPrice ? assetPrice.toFixed(2) : 0
                }`}</Text.Label>
                <S.ActionsContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => null} active>
                            <PlusIcon />
                        </CircleButton>
                        <Text.Body>Buy</Text.Body>
                    </S.ActionContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => null}>
                            <PortfolioSendIcon />
                        </CircleButton>
                        <Text.Body>Send</Text.Body>
                    </S.ActionContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => null}>
                            <PortfolioReceiveIcon />
                        </CircleButton>
                        <Text.Body>Receive</Text.Body>
                    </S.ActionContainer>
                </S.ActionsContainer>
            </S.Container>
            <AS.Container>
                <AS.AssetsHeader>
                    <Text.BodySmallBold>Chains</Text.BodySmallBold>
                </AS.AssetsHeader>
                <AS.ChainsContainer>
                    {filteredBalances
                        .sort((a, b) => parseInt(b.amount) - parseInt(a.amount))
                        .map((b, i) => (
                            <Asset symbol={symbol} balance={parseInt(b.amount)} chain={b.chain} token={token} />
                        ))}
                </AS.ChainsContainer>
            </AS.Container>
        </>
    );
};

export const AssetDetails = React.memo(AssetDetailsComponent);
