var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var AssetsPlugin = require('assets-webpack-plugin');

module.exports = {
    entry: {main: "./media/js/main.js"},
    output: {
        path: path.resolve(__dirname, 'static'),
        publicPath: "/static/",
        filename: 'scripts/main-bundle.js'
    },
    module: {
        loaders: [
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!sass-loader?sourceMap')},
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles/main-bundle-[hash].css'),
        new AssetsPlugin()
    ]
};