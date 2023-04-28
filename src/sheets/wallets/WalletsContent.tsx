import React from 'react';
import { useRecoilState } from 'recoil';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as S from '../styles';
import { Button, PressableSelector } from '../../components';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';

import { currentNetworkState, currentThemeState, openedSheetState, userWalletsState } from '../../state';

import { Wallet } from './Wallet';

const Content = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const [currentTheme] = useRecoilState(currentThemeState);
    const [currentNetwork] = useRecoilState(currentNetworkState);
    const [openedSheet, setOpenedSheet] = useRecoilState(openedSheetState);
    const [userWallets, setUserWallets] = useRecoilState(userWalletsState);

    return (
        <S.ContentContainer>
            <S.OffsetedContainer>
                <BottomSheetScrollView>
                    <S.SelectorsContainer>
                        {userWallets.map((wallet, index) => {
                            return <Wallet wallet={wallet} key={index} />;
                        })}
                    </S.SelectorsContainer>
                </BottomSheetScrollView>
                <Button
                    marginTop="auto"
                    active
                    height="46px"
                    text="Add Wallet"
                    onPress={() => setOpenedSheet('addWallet')}
                />
            </S.OffsetedContainer>
        </S.ContentContainer>
    );
};

export const WalletsContent = React.memo(Content);
