import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity<{ active?: boolean }>`
    width: 100%;
    height: 78px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: ${p => (p.active ? p.theme.palette.button.primary.background : p.theme.palette.background.muted)};
    border: 1px solid ${p => p.theme.palette.border.card};
    padding: 0px 18px;
    border-radius: 8px;
`;

export const InfoContainer = styled.View`
    flex: 1;
    gap: 8px;
`;

export const HeaderContainer = styled.View`
    align-items: center;
    gap: 8px;
`;

export const ButtonsContainer = styled.View`
    display: flex;
    flex-direction: row;
    margin-left: auto;
    align-items: center;
    gap: 10px;
    padding-left: 10px;
`;

export const WalletAddressContainer = styled.View`
    width: 50%;
    margin-top: 8px;
    margin-bottom: 24px;
`;
