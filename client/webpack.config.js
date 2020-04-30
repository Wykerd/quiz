const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const isEnvProduction = argv.mode === 'production';

    const config = {
        target: 'web',
        mode: isEnvProduction ? 'production' : 'development',
        entry: path.resolve(__dirname, 'src/index.tsx'),
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle.js',
            chunkFilename: isEnvProduction ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"]
        },
        module: {
            rules: [
                {
                    test: /\.ya?ml$/,
                    type: 'json',
                    use: 'yaml-loader'
                },
                {
                    enforce: 'pre',
                    test: /\.(js|ts)$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                },
                { 
                    test: /\.ts(x?)$/,
                    use: 'ts-loader'
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader, 
                        'css-loader', 
                        'postcss-loader'
                    ]
                },
                { 
                    test: /\.(png|jpe?g|gif)$/i, 
                    use: {
                        loader: 'file-loader', 
                        options: {
                            outputPath: 'static/images',
                            name: '[name].[contenthash:8].[ext]'
                        }
                    }
                }
            ]
        },
        plugins: [
            new webpack.ProgressPlugin(),
            new webpack.EnvironmentPlugin({
                NODE_ENV: isEnvProduction ? 'production' : 'development'
            }),
            new webpack.BannerPlugin('Copyright 2020 Daniel Wykerd'),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'src/index.html'),
                filename: 'index.html'
            }),
            new MiniCssExtractPlugin({
                filename: isEnvProduction ? 'static/css/[name].[contenthash:8].css' : 'static/css/[name].css',
                chunkFilename: '[id].css',
            })
        ]
    }

    if (!isEnvProduction) {
        config.devServer = {
            contentBase: path.resolve(__dirname, 'dist'),
            port: 9000,
            historyApiFallback: true
        };

        config.devtool = 'inline-source-map';
    } 

    return config;
}