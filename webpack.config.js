const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

var entries = {};
function getEntries(filePath) {
    fs.readdirSync(filePath, function(err, files){
        if (err) {
            throw new Error(err);
        }
        //遍历读取到的文件列表
        files.forEach(function(filename){
            var filedir = path.join(filePath, filename);
            fs.statSync(filedir, function(eror, stats){
                if (eror) {
                    throw new Error(err)
                    console.warn('获取文件stats失败');
                } else {
                    var isFile = stats.isFile();
                    var isDir = stats.isDirectory();
                    if(isFile && path.basename(filedir) === 'index.js'){
                        entries[path.dirname(filedir)] = filedir;
                        console.log(path.dirname(filedir), filedir)
                    }
                    if(isDir){
                        getEntries(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
                    }
                }
            })
        })
    })
}

console.log(11111111)
getEntries('./src');
//console.log(entries)
module.exports = {
    entry: path.resolve(__dirname, './main.js'),
    output: {
        path: path.resolve(__dirname, './dist'), // 输出的路径
        filename: 'app/[name]_[hash:8].js'  // 打包后文件
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
　　 　　new HtmlWebpackPlugin({
　　　　 　　template: path.resolve(__dirname, './index.html'),
　　　　　　 inject: true
　　　　 })
　　 ]
};