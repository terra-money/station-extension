import { IconButton, Text } from 'components';
import React from 'react';
import { useRecoilState } from 'recoil';
import { currentWalletState } from '../../state';
import { CopyIcon } from '../../icons';
import * as S from './Wallet.styled';
import { addressFromWords } from '../../utils';

const WalletComponent = ({ wallet }: { wallet: SingleWallet }) => {
    const { name, encrypted, words } = wallet;
    const [currentWallet, setCurrentWallet] = useRecoilState(currentWalletState);

    const address = addressFromWords(words['330']);

    return (
        <S.Container
            onPress={() => setCurrentWallet(wallet)}
            active={currentWallet.encrypted['118'] === wallet.encrypted['118']}>
            <S.InfoContainer>
                <Text.Body>{name}</Text.Body>
                <Text.BodySmallXX numberOfLines={1}>{address}</Text.BodySmallXX>
            </S.InfoContainer>
            <IconButton onPress={() => null}>
                <CopyIcon />
            </IconButton>
        </S.Container>
    );
};

export const Wallet = React.memo(WalletComponent);
