const moduleResolver = [
    'module-resolver',
    {
        alias: {
            components: './src/components/index.ts',
        },
    },
];

module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: ['@babel/plugin-proposal-export-namespace-from', 'react-native-reanimated/plugin', moduleResolver],
};
