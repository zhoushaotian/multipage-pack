const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const env = /-p/.test(process.argv[2]) ? 'production' : 'development';
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractLESS = new ExtractTextPlugin('[name]/index.[chunkhash:8].css');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const del = require('del');

del(path.resolve(__dirname, 'public/'));

const ROOT = path.resolve(__dirname, 'app/src');

const webpackOptions = {
    mode: env,
    entry: {
        
    },
    output: {
        filename: '[name]/index.[hash].js',
        path: path.resolve(__dirname, 'public/'),
    },
    devServer: {
        hot: true,
        inline: true,
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                loader: extractLESS.extract([
                    'css-loader',
                    'less-loader'
                ])
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader',
                query: {
                    name: 'font/[name].[hash:7].[ext]'
                }
            }
        ]
    },
    plugins: [
        extractLESS,
    ]
}
// 遍历需要编译的源目录
module.exports = new Promise(function(resolve, reject) {
    fs.readdir(ROOT, function(err, files) {
        if(err) {
            return reject(err);
        }
        files.filter((file) => !file.includes('.')).forEach(function(entry) {
            webpackOptions.entry[entry] = path.resolve(ROOT, entry , 'index.js'),
            webpackOptions.plugins.push(new HtmlWebpackPlugin({
                filename: entry + '/index.html',
                template: path.resolve(ROOT, entry , 'index.html'),
                inject: true,
                chunks: [entry]
            }))
        })
        resolve(webpackOptions);
    })
})