import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';

import { Text } from 'components';
import * as S from './GroupSelector.styled';
import { IconButton } from '../../buttons';
import { SmallRightArrowIcon } from '../../../icons';
import { RotatingArrow } from './RotatingArrow';

interface SelectorElementProps extends PropsWithChildren {
    title: string;
    selected: boolean;
    onPress: () => void;
    isFirst?: boolean;
}

const Selector = ({ children }: PropsWithChildren) => {
    return (
        <S.Container>
            {React.Children.map(children, (child, index) =>
                React.cloneElement(child as React.ReactElement, { isFirst: !index }),
            )}
        </S.Container>
    );
};

const Element = ({ onPress, title, selected, isFirst, children }: SelectorElementProps) => {
    const [isExpanded, setExpanded] = useState<boolean>(false);
    if (React.isValidElement(children)) {
        return (
            <>
                <S.Element onPress={onPress} isFirst={isFirst}>
                    <S.NameTouchableWrapper onPress={() => setExpanded(!isExpanded)}>
                        <Text.Title6Bold>{title}</Text.Title6Bold>
                        <RotatingArrow expanded={isExpanded} />
                    </S.NameTouchableWrapper>
                    <S.ElementIndicator selected={selected}>
                        {selected && <S.ElementIndicatorCircle />}
                    </S.ElementIndicator>
                </S.Element>
                {isExpanded && children}
            </>
        );
    }
    return (
        <S.Element onPress={onPress} isFirst={isFirst}>
            <Text.Title6Bold>{title}</Text.Title6Bold>
            <S.ElementIndicator selected={selected}>{selected && <S.ElementIndicatorCircle />}</S.ElementIndicator>
        </S.Element>
    );
};

export const GroupSelector = React.memo(Selector);
export const GroupSelectorElement = React.memo(Element);
