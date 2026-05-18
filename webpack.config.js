const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
            {
                test: /\.(pdf|docx?|xlsx?|pptx?|txt|csv|zip)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'documents/[name][ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'images', to: 'images', noErrorOnMissing: true },
                { from: 'documents', to: 'documents', noErrorOnMissing: true },
            ],
        }),
    ],
    mode: 'production',
};
