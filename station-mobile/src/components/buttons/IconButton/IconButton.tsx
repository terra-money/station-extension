import React from 'react';
import type { PropsWithChildren } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = PropsWithChildren<{
    onPress: () => void;
    disabled?: boolean;
    style?: TouchableOpacityProps['style'];
}>;

const Button = ({ onPress, style = {}, children }: ButtonProps) => {
    return (
        <TouchableOpacity style={style} onPress={onPress}>
            {children}
        </TouchableOpacity>
    );
};

export const IconButton = React.memo(Button);
