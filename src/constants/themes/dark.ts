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

export const darkTheme: DefaultTheme = {
    name: 'Dark',
    barStyle: 'light-content',
    border: {
        width: '1px',
    },
    palette: {
        extra: defaultExtras,
        button: {
            primary: {
                background: '#4572ED',
                text: '#F3F3F3',
            },
            default: {
                background: '#35353B',
                text: '#DEDEDE',
            },
        },
        menu: {
            background: '#29292E',
            border: '#35353B',
            text: '#E8E8E8',
        },
        text: {
            info: '#4572ED',
            default: '#F2F2F2',
            muted: '#8C8C8C',
        },
        background: {
            default: '#1F1F1F',
            muted: '#35353B',
            card: '#29292E',
            cardMuted: '#242428',
            input: '#29292E',
        },
        border: {
            card: '#35353B',
            input: '#4D4D4D',
        },
    },
};
