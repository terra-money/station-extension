import styled from 'styled-components/native';
import { ButtonSize } from './Rectangle';

interface RectangleContainerProps {
    size: ButtonSize;
    height?: string;
    width?: string;
    marginTop?: string;
    active?: boolean;
}

interface CircleContainerProps {
    size: number;
    active?: boolean;
    marginTop?: string;
}

export const RectangleContainer = styled.TouchableOpacity<RectangleContainerProps>`
    height: ${p => p.height || '32px'};
    width: ${p => p.width || '100%'};
    margin-top: ${p => p.marginTop || '0px'};
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${p =>
        p.active ? p.theme.palette.primary : p.theme.palette.dark700};
    padding: 0px 10px;
`;

export const CircleContainer = styled.TouchableOpacity<CircleContainerProps>`
    height: ${p => p.size}px;
    width: ${p => p.size}px;
    margin-top: ${p => p.marginTop || '0px'};
    border-radius: ${p => p.size / 2}px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${p =>
        p.active ? p.theme.palette.primary : p.theme.palette.dark700};
`;

export const IconContainer = styled.View`
    margin-right: 8px;
`;
