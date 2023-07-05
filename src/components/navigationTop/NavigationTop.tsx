import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useTheme } from 'styled-components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { MenuIcon, SettingsIcon, WalletIcon } from 'icons';
import { Text, Button, IconButton } from 'components';
import { openedSheetState, userWalletsState, currentWalletState } from '../../state';
import { getStoredWallets } from 'utils';

import * as S from './styles';

const Navigation = ({ navigation }) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [, setOpenedSheet] = useRecoilState(openedSheetState);
    const [userWallets] = useRecoilState(userWalletsState);
    const [currentWallet] = useRecoilState(currentWalletState);
    // const [wallets, setWallets] = useState<ResultStoredWallet[]>([]);

    return (
        <S.Container paddingTop={insets.top}>
            <S.NavigationContainer>
                {userWallets.length === 0 && (
                    <Button onPress={() => setOpenedSheet('addWallet')} text="Connect" width="100px" />
                )}
                {currentWallet ? (
                    <>
                        <WalletIcon style={{ marginRight: 12 }} />
                        <Text.Body color={theme.palette.menu.text}>{currentWallet?.name}</Text.Body>
                        <IconButton onPress={() => setOpenedSheet('wallets')}>
                            <MenuIcon />
                        </IconButton>
                    </>
                ) : null}
                <IconButton style={{ marginLeft: 'auto' }} onPress={() => setOpenedSheet('settings')}>
                    <SettingsIcon />
                </IconButton>
            </S.NavigationContainer>
        </S.Container>
    );
};

export const NavigationTop = React.memo(Navigation);
