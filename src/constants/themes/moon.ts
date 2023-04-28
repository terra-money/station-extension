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

export const moonTheme: DefaultTheme = {
    name: 'Moon',
    barStyle: 'light-content',
    border: {
        width: '1px',
    },
    palette: {
        extra: defaultExtras,
        button: {
            primary: {
                background: '#F9D75D',
                text: '#0C0920',
            },
            default: {
                background: '#F9D75D',
                text: '#0C0920',
            },
        },
        menu: {
            background: '#0D0A24',
            border: '#FFFFFF15',
            text: '#A0A0B0',
        },
        text: {
            info: '#F9D75D',
            default: '#A0A0B0',
            muted: '#5F5D6F',
        },
        background: {
            default: '#05040C',
            muted: '#0C0920',
            card: '#0D0A24',
            cardMuted: '#130f32',
            input: '#0D0A24',
        },
        border: {
            card: '#35353B',
            input: '#FFFFFF10',
        },
    },
};
