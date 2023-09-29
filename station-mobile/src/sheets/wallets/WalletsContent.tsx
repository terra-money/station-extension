import React from 'react';
import { useRecoilState } from 'recoil';

import * as S from '../styles';
import { Button, PressableSelector } from '../../components';

import { currentNetworkState, currentThemeState, openedSheetState, userWalletsState } from '../../state';

import { Wallet } from './Wallet';

const Content = ({ navigation }) => {
    const [currentTheme] = useRecoilState(currentThemeState);
    const [currentNetwork] = useRecoilState(currentNetworkState);
    const [openedSheet, setOpenedSheet] = useRecoilState(openedSheetState);
    const [userWallets, setUserWallets] = useRecoilState(userWalletsState);

    return (
        <S.ContentContainer>
            <S.OffsetedContainer>
                <S.SelectorsContainer>
                    {userWallets.map((wallet, index) => {
                        return <Wallet wallet={wallet} key={index} navigation={navigation} />;
                    })}
                </S.SelectorsContainer>
            </S.OffsetedContainer>
            <S.BottomButtonsWrapper>
                <Button
                    marginTop="auto"
                    active
                    height="46px"
                    text="Add Wallet"
                    onPress={() => setOpenedSheet('addWallet')}
                />
            </S.BottomButtonsWrapper>
        </S.ContentContainer>
    );
};

export const WalletsContent = React.memo(Content);
