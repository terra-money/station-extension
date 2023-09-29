import React from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentWalletState, openedSheetState } from '../../../state';
import { CircleButton, Text } from 'components';
import { PlusIcon, PortfolioReceiveIcon, PortfolioSendIcon, SwapIcon } from 'icons';

import * as S from './PortfolioHeader.styled';
import { useTheme } from 'styled-components';
import { useBankBalance } from '../../../utils/queries/bank';
import { useExchangeRates } from 'utils';
import { useNativeDenoms } from 'utils';
import { useNavigation } from '@react-navigation/native';

const PortfolioHeaderComponent = () => {
    const theme = useTheme();
    const coins = useBankBalance();
    const readNativeDenom = useNativeDenoms();
    const { data: prices } = useExchangeRates();
    const [wallet] = useRecoilState(currentWalletState);

    const setOpenedSheet = useSetRecoilState(openedSheetState);

    const coinsValue = coins?.reduce((acc, { amount, denom }) => {
        const { token, decimals, symbol } = readNativeDenom(denom);
        return acc + (parseInt(amount) * (symbol?.endsWith('...') ? 0 : prices?.[token]?.price ?? 0)) / 10 ** decimals;
    }, 0);

    return (
        <>
            <S.BorderLine />
            <S.Container>
                <Text.Title6 color={theme.palette.dark900}>Portfolio</Text.Title6>
                <Text.Title3>{wallet ? `$${coinsValue.toFixed(2)}` : '--'}</Text.Title3>
                <S.ActionsContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => setOpenedSheet('send')} active>
                            <PortfolioSendIcon />
                        </CircleButton>
                        <Text.Body color={theme.palette.white}>Send</Text.Body>
                    </S.ActionContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => setOpenedSheet('send')}>
                            <SwapIcon />
                        </CircleButton>
                        <Text.Body color={theme.palette.white}>Swap</Text.Body>
                    </S.ActionContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => setOpenedSheet('receive')}>
                            <PortfolioReceiveIcon />
                        </CircleButton>
                        <Text.Body color={theme.palette.white}>Receive</Text.Body>
                    </S.ActionContainer>
                    <S.ActionContainer>
                        <CircleButton onPress={() => null}>
                            <PlusIcon />
                        </CircleButton>
                        <Text.Body color={theme.palette.white}>Buy</Text.Body>
                    </S.ActionContainer>
                </S.ActionsContainer>
            </S.Container>
        </>
    );
};

export const PortfolioHeader = React.memo(PortfolioHeaderComponent);
