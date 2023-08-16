import styled from 'styled-components/native';

export const Container = styled.View`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 25px;
    background: ${p => p.theme.palette.dark};
`;

export const BorderLine = styled.View`
    width: 100%;
    height: 1px;
    background: ${p => p.theme.palette.dark700};
`;

export const ActionsContainer = styled.View`
    display: flex;
    flex-direction: row;
    gap: 32px;
    margin-top: 20px;
`;

export const ActionContainer = styled.View`
    display: flex;
    gap: 8px;
    align-items: center;
`;
