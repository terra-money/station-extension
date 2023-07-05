import styled from 'styled-components/native';

export const AssetContainer = styled.TouchableOpacity`
    width: 100%;
    height: 64px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const AssetRightButtonsContainer = styled.View`
    margin-left: auto;
    display: flex;
    flex-direction: row;
    gap: 12px;
`;

export const NameContainer = styled.View`
    width: 30%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-left: 8px;
`;

export const IconContainer = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 34px;
    width: 34px;
    border-radius: 17px;
    background-color: ${p => p.theme.palette.background.muted};
`;

export const QRCodeScreenContainer = styled.View`
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
`;
