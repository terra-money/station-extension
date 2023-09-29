import styled from 'styled-components/native';

export const Container = styled.View`
    padding: 15px 10px;
    flex: 1;
    background-color: ${p => p.theme.palette.dark600};
`;

export const AssetsHeader = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10px;
`;

export const IconContainer = styled.View`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 48px;
    width: 48px;
`;

export const ChainsContainer = styled.ScrollView``;
