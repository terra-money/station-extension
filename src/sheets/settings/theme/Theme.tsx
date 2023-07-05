import React from 'react';
import { useRecoilState } from 'recoil';
import { GroupSelector, GroupSelectorElement, Text } from 'components';
import { availableThemes } from '../../../constants/themes';
import { currentThemeState } from '../../../state';

import * as GS from '../../styles';

const Theme = () => {
    const [currentTheme, setCurrentTheme] = useRecoilState(currentThemeState);
    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>Theme</Text.Title4>
                </GS.TitleContainer>
                <GroupSelector>
                    {availableThemes.map(theme => {
                        return (
                            <GroupSelectorElement
                                selected={currentTheme === theme.name}
                                key={theme.name}
                                title={theme.name}
                                onPress={() => setCurrentTheme(theme.name)}
                            />
                        );
                    })}
                </GroupSelector>
            </GS.OffsetedContainer>
        </GS.ContentContainer>
    );
};

export const ThemeSettings = React.memo(Theme);
