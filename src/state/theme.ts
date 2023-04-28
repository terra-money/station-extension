import { atom } from 'recoil';
import { darkTheme } from '../constants/themes';

export const currentThemeState = atom({ key: 'currentTheme', default: darkTheme.name });
