import styled from 'styled-components/native';

export const Container = styled.View<{ marginTop?: string }>`
    width: 100%;
    display: flex;
    margin-top: ${p => p.marginTop || '0px'};
`;

export const InputContainer = styled.TextInput<{ minHeight?: string }>`
    width: 100%;
    min-height: ${p => p.minHeight || '46px'};
    margin-top: 8px;
    padding: 12px;
    background-color: ${p => p.theme.palette.background.input};
    border-radius: 8px;
    border: 1px solid ${p => p.theme.palette.border.input};
    color: ${p => p.theme.palette.text.default};
`;
