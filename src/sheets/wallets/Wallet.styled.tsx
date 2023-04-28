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
    display: flex;
    max-width: 80%;
    margin-right: auto;
    gap: 8px;
`;
