const path = require('path');

module.exports = {
    name: 'electron',
    entry: './src/index.ts',
    output: {
        path: path.resolve('build'),
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
                    'ts-loader',
                ],
            },
            {
                test: /\.html$/,
                loader: 'my-vue-loader'
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
            base: path.resolve('src')
        }
    },
    performance: {
        hints: false
    },
};