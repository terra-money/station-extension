import React from 'react';
import { useRecoilState } from 'recoil';
import Clipboard from '@react-native-clipboard/clipboard';

import { IconButton, Text } from 'components';
import { currentWalletState } from '../../state';
import { CopyIcon, MoreVerticalIcon } from '../../icons';
import { addressFromWords } from '../../utils';

import * as S from './Wallet.styled';

const WalletComponent = ({ wallet, navigation }: { wallet: SingleWallet }) => {
    const { name, encrypted, words } = wallet;
    const [currentWallet, setCurrentWallet] = useRecoilState(currentWalletState);

    const address = addressFromWords(words['330']);

    return (
        <S.Container onPress={() => setCurrentWallet(wallet)} active={currentWallet.name === wallet.name}>
            <S.InfoContainer>
                <Text.Body>{name}</Text.Body>
                <Text.BodySmallXX ellipsizeMode="middle" numberOfLines={1}>
                    {address}
                </Text.BodySmallXX>
            </S.InfoContainer>
            <S.ButtonsContainer>
                <IconButton onPress={() => Clipboard.setString(address)}>
                    <CopyIcon />
                </IconButton>
                <IconButton
                    onPress={() => {
                        setCurrentWallet(wallet);
                        navigation.navigate('manage', { wallet });
                    }}>
                    <MoreVerticalIcon />
                </IconButton>
            </S.ButtonsContainer>
        </S.Container>
    );
};

export const Wallet = React.memo(WalletComponent);
