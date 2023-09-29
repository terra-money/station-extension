import styled from 'styled-components/native';

export const ChainsContainer = styled.View`
    display: flex;
    flex-direction: row;
    background-color: ${p => p.theme.palette.dark200};
    padding: 8px 12px;
    gap: 8px;
    flex-wrap: wrap;
`;

export const ChainContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 20px;
    border-radius: 10px;
    background-color: ${p => p.theme.palette.background.card};
    padding: 0px 8px;
`;

export const ChainIconWrapper = styled.View`
    width: 12px;
    height: 12px;
    margin-right: 8px;
`;
