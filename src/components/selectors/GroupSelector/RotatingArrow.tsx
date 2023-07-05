import React, { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { SmallUpArrowIcon } from 'icons';

import * as S from './GroupSelector.styled';

interface ButtonProps {
    expanded: boolean;
}

const Arrow = ({ expanded }: ButtonProps) => {
    const rotation = useSharedValue('0deg');

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
    }, [expanded]);

    return (
        <S.ArrowIconContainer>
            <Animated.View style={[animatedStyles]}>
                <SmallUpArrowIcon />
            </Animated.View>
        </S.ArrowIconContainer>
    );
};

export const RotatingArrow = React.memo(Arrow);
