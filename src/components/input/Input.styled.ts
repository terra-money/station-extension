import styled from 'styled-components/native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

export const Container = styled.View<{ marginTop?: string }>`
    width: 100%;
    display: flex;
    margin-top: ${p => p.marginTop || '0px'};
`;

export const InputContainer = styled(BottomSheetTextInput)<{ minHeight?: string }>`
    width: 100%;
    min-height: ${p => p.minHeight || '46px'};
    margin-top: 8px;
    padding: 12px;
    background-color: ${p => p.theme.palette.background.input};
    border-radius: 8px;
    border: 1px solid ${p => p.theme.palette.border.input};
    color: ${p => p.theme.palette.text.default};
`;

export const ErrorMessageContainer = styled.View`
    margin-top: 4px;
`;

export const InputHeaderContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const ActionButtonContainer = styled.TouchableOpacity``;
