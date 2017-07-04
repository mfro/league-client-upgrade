const path = require('path');

module.exports = {
    name: 'electron',
    entry: path.resolve(__dirname, 'src/main.ts'),

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                options: { presets: ['es2015'] }
            },
            {
                test: /\.ts$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: { presets: ['es2015'] }
                    },
                    {
                        loader: 'ts-loader',
                        options: { logLevel: 'warn' }
                    }
                ],
            },
            {
                test: /\.html$/,
                loader: '@mfro/vue-loader'
            },
            {
                test: /\.less$/,
                use: [
                    path.resolve('delayed-style-loader'),
                    'css-loader',
                    {
                        loader: 'less-loader',
                        options: { strictMath: true }
                    }
                ]
            },
        ]
    },

    resolve: {
        extensions: ['.js', '.ts'],

        alias: {
            'zhonya': path.resolve(__dirname, 'src'),
        }
    },

    performance: {
        hints: false
    },
};