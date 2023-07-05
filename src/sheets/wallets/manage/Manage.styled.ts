import styled from 'styled-components/native';

export const Container = styled.View`
    background-color: ${p => p.theme.palette.background.cardMuted};
    flex: 1;
    align-items: center;
`;

export const Header = styled.View`
    display: flex;
    flex-direction: row;
    gap: 8px;
`;

export const WalletAddressContainer = styled.View`
    width: 50%;
    margin-top: 8px;
    margin-bottom: 24px;
`;

export const SelectorsContainer = styled.View`
    display: flex;
    padding: 0px 24px;
    gap: 8px;
`;
