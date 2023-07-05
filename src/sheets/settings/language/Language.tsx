import React from 'react';
import { GroupSelector, GroupSelectorElement, Text } from 'components';

import * as GS from '../../styles';

const Language = () => {
    return (
        <GS.ContentContainer>
            <GS.OffsetedContainer>
                <GS.TitleContainer>
                    <Text.Title4>Language</Text.Title4>
                </GS.TitleContainer>
                <GroupSelector>
                    {['English'].map(language => {
                        return (
                            <GroupSelectorElement
                                selected={true}
                                key={language}
                                title={language}
                                onPress={() => null}
                            />
                        );
                    })}
                </GroupSelector>
            </GS.OffsetedContainer>
        </GS.ContentContainer>
    );
};

export const LanguageSettings = React.memo(Language);
