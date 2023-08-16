import styled from 'styled-components/native';

export const Container = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    background: ${p => p.theme.palette.warning100};
    border-radius: 8px;
    padding: 8px;
    box-sizing: border-box;
`;

export const IconContainer = styled.View``;

export const TextContainer = styled.View`
    margin-left: 8px;
`;
