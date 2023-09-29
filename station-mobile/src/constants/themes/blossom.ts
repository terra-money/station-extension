import { DefaultTheme } from 'styled-components';

export const defaultExtras: DefaultTheme['palette']['extra'] = {
    buttonDanger: '#FF5762',
    info: '#3774F6',
    infoLight: '#4572ED1A',
    warning: '#FC9803',
    warningLight: '#FC98031A',
    success: '#1DAA8E',
    successLight: '#1DAA8E1A',
    danger: '#EE4444',
    dangerLight: '#EE44441A',
};

export const blossomTheme: DefaultTheme = {
    name: 'Blossom',
    barStyle: 'light-content',
    border: {
        width: '1px',
    },
    palette: {
        extra: defaultExtras,
        button: {
            primary: {
                background: '#FF2E70',
                text: '#F3F3F3',
            },
            default: {
                background: '#FFE5F2',
                text: '#ED3B70',
            },
        },
        menu: {
            background: '#DF303E',
            border: '#FFFFFF10',
            text: '#E8E8E8',
        },
        text: {
            info: '#FF70CD',
            default: '#F62C69',
            muted: '#FF858D',
        },
        background: {
            default: '#FFEBF8',
            muted: '#FFF0FA',
            card: '#FFF5FF',
            cardMuted: '#FFE5F2',
            input: '#FFF5FF',
        },
        border: {
            card: '#FFE0EA',
            input: '#FFD6E1',
        },
    },
};
