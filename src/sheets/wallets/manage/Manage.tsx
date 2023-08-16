import React from 'react';

import * as S from './Manage.styled';
import { Text, PressableSelector } from '../../../components';
import { useTheme } from 'styled-components';
import { addressFromWords } from '../../../utils';
import { ChangeWalletPasswordIcon, DeleteWalletIcon, ExportWalletIcon, LockWalletIcon } from '../../../icons';

const ManageWalletComponent = ({ navigation, route }) => {
    const theme = useTheme();
    const {
        params: { wallet },
    } = route;

    const address = addressFromWords(wallet.words['330']);

    return (
        <S.Container>
            <S.Header>
                <Text.Title4>Manage</Text.Title4>
                <Text.Title4 color={theme.palette.text.info}>{wallet.name}</Text.Title4>
            </S.Header>
            <S.WalletAddressContainer>
                <Text.Label numberOfLines={1} color={theme.palette.dark900}>
                    {address}
                </Text.Label>
            </S.WalletAddressContainer>
            <S.SelectorsContainer>
                <PressableSelector
                    Icon={ExportWalletIcon}
                    title="Export Wallet"
                    onPress={() => navigation.navigate('export', { wallet })}
                />
                <PressableSelector
                    Icon={ChangeWalletPasswordIcon}
                    title="Change password"
                    onPress={() => navigation.navigate('changePassword', { wallet })}
                />
                <PressableSelector
                    Icon={DeleteWalletIcon}
                    title="Delete wallet"
                    onPress={() => navigation.navigate('deleteWallet', { wallet })}
                />
                <PressableSelector Icon={LockWalletIcon} title="Lock" onPress={() => null} />
            </S.SelectorsContainer>
        </S.Container>
    );
};

export const ManageWallet = React.memo(ManageWalletComponent);
