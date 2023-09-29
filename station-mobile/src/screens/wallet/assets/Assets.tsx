import React, { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { Text, TextButton, NavigationTop } from 'components';

import { PortfolioHeader } from '../portfolio';

import { Asset } from './Asset';

import * as S from './Assets.styled';
import { isNativeToken, useBankBalance, useExchangeRates, useIsWalletEmpty, useNativeDenoms } from 'utils';
import { readAmount } from '@terra-money/terra-utils';

const toInput = (amount: BigNumber.Value, decimals = 6) => new BigNumber(readAmount(amount, { decimals })).toNumber();

const AssetsView = ({ navigation }) => {
    const isWalletEmpty = useIsWalletEmpty();
    // const { hideNoWhitelist, hideLowBal } = useTokenFil();
    const hideNoWhitelist = false;
    const hideLowBal = false;
    const coins = useBankBalance();
    const { data: prices } = useExchangeRates();
    const readNativeDenom = useNativeDenoms();
    const list = useMemo(
        () =>
            [
                ...Object.values(
                    coins.reduce((acc, { denom, amount, chain }) => {
                        const data = readNativeDenom(denom);
                        if (acc[data.token]) {
                            acc[data.token].balance = `${parseInt(acc[data.token].balance) + parseInt(amount)}`;
                            acc[data.token].chains.push(chain);
                            return acc;
                        } else {
                            const isWhitelisted = !denom.endsWith('...');
                            return {
                                ...acc,
                                [data.token]: {
                                    denom,
                                    balance: amount,
                                    icon: data.icon,
                                    symbol: data.symbol,
                                    price: isWhitelisted ? prices?.[data.token]?.price ?? 0 : 0,
                                    change: isWhitelisted ? prices?.[data.token]?.change ?? 0 : 0,
                                    chains: [chain],
                                },
                            };
                        }
                    }, {} as Record<string, any>),
                ),
            ]
                .filter(
                    a => (hideNoWhitelist ? !a.symbol.endsWith('...') : true), // TODO: update and implement whitelist check
                )
                .filter(a => {
                    if (!(hideLowBal && a.price === 0) || isNativeToken(a.denom)) {
                        return true;
                    }
                    return a.price * toInput(a.balance) >= 1;
                })
                .sort((a, b) => b.price * parseInt(b.balance) - a.price * parseInt(a.balance)),
        [coins, readNativeDenom, prices, hideNoWhitelist, hideLowBal],
    );

    return (
        <>
            <NavigationTop navigation={navigation} />
            <PortfolioHeader />
            <S.Container>
                <S.AssetsHeader>
                    <Text.BodySmallBold>Assets</Text.BodySmallBold>
                    <TextButton onPress={() => null} text="Manage tokens" />
                </S.AssetsHeader>
                <S.AssetsContainer>
                    {isWalletEmpty && (
                        <Asset
                            onPress={() =>
                                navigation.navigate('assetDetails', {
                                    asset: {
                                        name: 'LUNA',
                                        iconUri: 'https://station-assets.terra.money/img/chains/Terra.svg',
                                    },
                                })
                            }
                            balance={0}
                            symbol="LUNA"
                            icon="https://station-assets.terra.money/img/chains/Terra.svg"
                            change={13.02}
                        />
                    )}
                    {list.map(coin => (
                        <Asset
                            {...coin}
                            onPress={() =>
                                navigation.navigate('assetDetails', {
                                    asset: coin,
                                })
                            }
                        />
                    ))}
                </S.AssetsContainer>
            </S.Container>
        </>
    );
};

export const Assets = React.memo(AssetsView);
