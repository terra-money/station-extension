import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuIcon, SettingsIcon, WalletIcon } from '../../icons';
import { Text } from '../texts';
import { openedSheetState, userWalletsState, currentWalletState } from '../../state';

import * as S from './styles';
import { Button, IconButton } from '../buttons';
import { useTheme } from 'styled-components';
import { getStoredWallets } from '../../utils';

const Navigation = ({ navigation }) => {
    console.log('navigation', navigation);
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [openedSheet, setOpenedSheet] = useRecoilState(openedSheetState);
    const [userWallets, setUserWallets] = useRecoilState(userWalletsState);
    const [currentWallet, setCurrentWallet] = useRecoilState(currentWalletState);

    const [wallets, setWallets] = useState<ResultStoredWallet[]>([]);

    useEffect(() => {
        const storedWallets = getStoredWallets();
        setUserWallets(storedWallets);
        if (storedWallets.length) {
            setCurrentWallet(storedWallets[0]);
        }
    }, []);

    return (
        <S.Container paddingTop={insets.top}>
            <S.NavigationContainer>
                {userWallets.length === 0 && (
                    <Button onPress={() => setOpenedSheet('addWallet')} text="Connect" width="100px" />
                )}
                <WalletIcon style={{ marginRight: 12 }} />
                <Text.Body color={theme.palette.menu.text}>{currentWallet?.name}</Text.Body>
                <IconButton onPress={() => setOpenedSheet('wallets')}>
                    <MenuIcon />
                </IconButton>
                <IconButton style={{ marginLeft: 'auto' }} onPress={() => setOpenedSheet('settings')}>
                    <SettingsIcon />
                </IconButton>
            </S.NavigationContainer>
        </S.Container>
    );
};

export const NavigationTop = React.memo(Navigation);
