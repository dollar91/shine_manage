const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const entries = {};
const plugins = [];
function getEntries(filePath) {
    var filePaths = fs.readdirSync(filePath);
    filePaths.forEach(function(item){
        var filedir = path.join(filePath, item),
            stats = fs.statSync(filedir),
            isFile = stats.isFile(),
            isDir = stats.isDirectory();
        if (isFile && path.basename(filedir) === 'index.js') {
            entries[path.dirname(filedir).replace('src/', '')] = path.join(__dirname, filedir);
        }
        if(isDir){
            getEntries(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件
        }
    });
}
getEntries('src');
Object.keys(entries).forEach(function(chunkName){
    try {
        var htmlTemplatePath = path.join(__dirname, 'src', chunkName, 'index.html'),
            htmlTemplateStat = fs.statSync(htmlTemplatePath);
        if (htmlTemplateStat && htmlTemplateStat.isFile()) {
            plugins.push(new HtmlWebpackPlugin({
                template: htmlTemplatePath,
                filename: 'html/'+chunkName+'.html',
                chunks: [chunkName],
                inject: true
            }));
        }
    } catch(e) {
        if (e.code !== 'ENOENT') {
            throw e;
        }
    }
});
module.exports = {
    entry: entries,
    output: {
        //path: path.resolve(__dirname, './dist'), // 输出的路径
        filename: 'assests/[name].[id].[chunkhash].js',  // 打包后文件
        chunkFilename: 'assests/[name].[chunkhash].js', // 未被列入entry而又需要打包的文件
        publicPath: '/' // 为所有的资源文件指定基础路径
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
    plugins: plugins
};