import styled from 'styled-components/native';

export const MainContainer = styled.View`
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    flex: 1;
    background-color: rgba(1, 1, 1, 0.5);
`;

export const ContentContainer = styled.SafeAreaView`
    flex: 1;
    background-color: ${p => p.theme.palette.background.cardMuted};
`;

export const OffsetedContainer = styled.View`
    flex: 1;
    align-items: center;
    padding: 0px 24px;
`;

export const SelectorsContainer = styled.View`
    width: 100%;
    display: flex;
    row-gap: 12px;
`;

export const BottomButtonsWrapper = styled.View<{ bottomPadding: number }>`
    width: 100%;
    margin-top: auto;
    padding-bottom: ${p => p.bottomPadding + 8}px;
`;

export const TitleContainer = styled.View`
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
