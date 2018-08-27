const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

var entries = {};
function getEntries(filePath) {
    var filePaths = fs.readdirSync(filePath);
    filePaths.forEach(function(item){
        var filedir = path.join(filePath, item),
            stats = fs.statSync(filedir),
            isFile = stats.isFile(),
            isDir = stats.isDirectory();
        if (isFile && path.basename(filedir) === 'index.js') {
            entries[path.dirname(filedir)] = filedir;
        }
        if(isDir){
            getEntries(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });
}
getEntries('src')
module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, './dist'), // 输出的路径
        filename: '[name]_[hash:8].js'  // 打包后文件
    },
    devServer: {
        inline: true,
        port: 3333
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }]
    },
     plugins: [
// 　　 　　new HtmlWebpackPlugin({
// 　　　　 　　template: path.resolve(__dirname, './index.html'),
// 　　　　　　 inject: true
// 　　　　 })
　　 ]
};