import React from 'react';
import * as S from '../styles';

import { PressableSelector, Text } from '../../components';

import { useRecoilState } from 'recoil';
import { currentNetworkState, currentThemeState } from '../../state';

const Content = ({ navigation }) => {
    const [currentTheme] = useRecoilState(currentThemeState);
    const [currentNetwork] = useRecoilState(currentNetworkState);
    return (
        <S.ContentContainer>
            <S.OffsetedContainer>
                <S.TitleContainer>
                    <Text.Title4>Settings</Text.Title4>
                </S.TitleContainer>
                <S.SelectorsContainer>
                    <PressableSelector
                        title="Network"
                        selectedText={currentNetwork}
                        onPress={() => navigation.navigate('network')}
                    />
                    <PressableSelector
                        title="Language"
                        selectedText="English"
                        onPress={() => navigation.navigate('language')}
                    />
                    <PressableSelector
                        title="Currency"
                        selectedText="USD"
                        onPress={() => navigation.navigate('currency')}
                    />
                    <PressableSelector
                        title="Theme"
                        selectedText={currentTheme}
                        onPress={() => navigation.navigate('theme')}
                    />
                </S.SelectorsContainer>
            </S.OffsetedContainer>
            {/* {currentSettings && (
                <S.BottomButtonsWrapper bottomPadding={insets.bottom}>
                    <Button height="46px" text="Back" onPress={() => setCurrentSettings(null)} />
                </S.BottomButtonsWrapper>
            )} */}
        </S.ContentContainer>
    );
};

export const SettingsContent = React.memo(Content);
