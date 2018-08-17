# webpack多页打包示例
使用webpack进行多页应用的打包，每个html对应一个入口，自动引入同一目录下的同名资源(js、less)
## 配置
```js
const webpackOptions = {
    mode: env,  // webpack各个环节的默认配置
    entry: {
                // 这里需要动态加载入口
    },
    output: {
        filename: '[name]/index.[hash].js',
        path: path.resolve(__dirname, 'public/'),
    },
    devServer: { // devserver的配置
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
        extractLESS,  // 将less文件单独提出为css
    ]
}
```
配置关键点在于如何动态添加入口，这里我们用fs模块读取src目录中的目录，每一个目录为一个页面，以其中的index.js为入口。
```js
// 遍历需要编译的源目录
module.exports = new Promise(function(resolve, reject) {
    fs.readdir(ROOT, function(err, files) {
        if(err) {
            return reject(err);
        }
        files.filter((file) => !file.includes('.')).forEach(function(entry) {
            webpackOptions.entry[entry] = path.resolve(ROOT, entry , 'index.js'),
            webpackOptions.plugins.push(new HtmlWebpackPlugin({ // 目录下的html也需要打包
                filename: entry + '/index.html',
                template: path.resolve(ROOT, entry , 'index.html'),
                inject: true,
                chunks: [entry] // 只插入同一目录下的js文件避免所有js的插入
            }))
        })
        resolve(webpackOptions);
    })
})
```
## webpack-dev-server
开发环境使用webpack-dev-server可以提高开发效率，需要额外安装webpack-dev-server，另外extract-text-webpack-plugin最新版本才会支持webpack4。webpack-dev-server的自动刷新有两种模式，第一种模式是inline模式，该模式在打包的时候会自动向打包js中注入自动刷新的钩子，iframe模式需要我们访问/webpack-dev-server/xxx，以iframe的形式注入我们的页面。开启inline模式只需要允许webpack-dev-server的时候加入参数 --inline，例如访问src下的home页面，路径为localhost:port/home/index.html。