import styled from 'styled-components/native';

export const Container = styled.View<{ paddingTop: number }>`
    padding-top: ${p => p.paddingTop}px;
    background: ${p => p.theme.palette.menu.background};
`;

export const NavigationContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 18px;
`;
