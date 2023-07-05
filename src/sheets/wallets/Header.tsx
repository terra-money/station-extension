import React from 'react';

import * as S from './Wallet.styled';
import { Text } from '../../components';
import { useTheme } from 'styled-components';
import { addressFromWords } from '../../utils';

const WalletManagementHeaderComponent = ({ wallet, header }) => {
    const theme = useTheme();
    const address = addressFromWords(wallet.words['330']);
    return (
        <S.HeaderContainer>
            <Text.Title4>{header}</Text.Title4>
            <S.WalletAddressContainer>
                <Text.Label numberOfLines={1} color={theme.palette.text.muted}>
                    {address}
                </Text.Label>
            </S.WalletAddressContainer>
        </S.HeaderContainer>
    );
};

export const WalletManagementHeader = React.memo(WalletManagementHeaderComponent);
