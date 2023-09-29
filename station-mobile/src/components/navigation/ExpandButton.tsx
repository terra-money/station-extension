import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SwapIcon } from 'icons';

import * as S from './styles';

interface ButtonProps {
    onExpand: () => void;
    expanded: boolean;
}

const Button = ({ onExpand, expanded }: ButtonProps) => {
    const rotation = useSharedValue('180deg');

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: rotation.value }],
        };
    });

    useEffect(() => {
        if (expanded) {
            rotation.value = withSpring('0deg');
        } else {
            rotation.value = withSpring('180deg');
        }
    }, [expanded, rotation]);

    return (
        <S.ExpandButton onPress={onExpand} activeOpacity={0.5}>
            <Animated.View style={[animatedStyles]}>
                <SwapIcon />
            </Animated.View>
        </S.ExpandButton>
    );
};

export const ExpandButton = React.memo(Button);
