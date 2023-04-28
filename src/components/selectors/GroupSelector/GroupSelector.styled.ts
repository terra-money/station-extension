import styled from 'styled-components/native';

export const Container = styled.View`
    width: 100%;
    background-color: ${p => p.theme.palette.background.card};
    border: 1px solid ${p => p.theme.palette.border.card};
    border-radius: 8px;
    overflow: hidden;
`;

export const Element = styled.TouchableOpacity<{ isFirst?: boolean }>`
    width: 100%;
    height: 42px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px 18px;
    border-top-width: ${p => (p.isFirst ? 0 : 1)}px;
    border-top-color: ${p => p.theme.palette.border.card};
`;

export const ElementIndicator = styled.View<{ selected: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 16px;
    width: 16px;
    border-radius: 8px;
    border: 1px solid ${p => (p.selected ? p.theme.palette.text.default : p.theme.palette.text.muted)};
    margin-left: auto;
`;

export const ElementIndicatorCircle = styled.View`
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: ${p => p.theme.palette.text.default};
`;

export const NameTouchableWrapper = styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const ArrowIconContainer = styled.View`
    margin-left: 8px;
`;
