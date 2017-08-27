const path = require('path');
const webpack = require('webpack');

module.exports = function (env) {
    const config = {
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
                '@': path.resolve(__dirname, 'src'),
            }
        },

        performance: {
            hints: false
        },

        plugins: []
    };

    if (env == 'prod') {
        config.plugins.push(new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
        }));

        config.plugins.push(new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }));
    }

    return config;
}