import { atom } from 'recoil';
import { darkTheme } from '../constants/themes';
import { persistAtom } from 'utils';

export const currentThemeState = atom({
    key: 'currentTheme',
    default: darkTheme.name,
    effects: [persistAtom('currentTheme')],
});
