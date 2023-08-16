import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

export const ContentContainer = styled.View`
    flex: 1;
    align-items: center;
    height: 100%;
    background-color: ${p => p.theme.palette.dark};
`;

export const OffsetedContainer = styled.ScrollView`
    height: 100%;
    width: 100%;
    padding: 0px 24px;
`;

export const SelectorsContainer = styled.View`
    width: 100%;
    display: flex;
    row-gap: 12px;
`;

const BottomButtonsWrapperComponent = styled.View<{ bottomPadding: number }>`
    width: 100%;
    padding: 0px 24px;
    margin-top: auto;
    padding-bottom: ${p => p.bottomPadding + 8}px;
`;

// Not to call this hook in each component
export const BottomButtonsWrapper = ({ children }: { children: React.ReactNode }) => {
    const insets = useSafeAreaInsets();
    return <BottomButtonsWrapperComponent bottomPadding={insets.bottom}>{children}</BottomButtonsWrapperComponent>;
};

export const TitleContainer = styled.View`
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 32px;
    margin-top: 16px;
`;

export const VerticalStack = styled.View`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 16px;
`;
