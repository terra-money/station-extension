const moduleResolver = [
    'module-resolver',
    {
        alias: {
            components: './src/components/index.ts',
            utils: './src/utils/index.ts',
            icons: './src/icons/index.ts',
            store: './src/state/index.ts',
            constants: './src/constants/index.ts',
        },
    },
];

module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: ['@babel/plugin-proposal-export-namespace-from', 'react-native-reanimated/plugin', moduleResolver],
};
