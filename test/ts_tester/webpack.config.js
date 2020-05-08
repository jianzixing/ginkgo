// 该文件其实最终是要在node环境下执行的
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

// 导出一个具有特殊属性配置的对象
module.exports = function (webpackEnv) {
    const isEnvDevelopment = webpackEnv === 'development';
    const isEnvProduction = webpackEnv === 'production';

    return {
        mode: 'development',

        optimization: {
            minimize: isEnvProduction
        },

        entry: {
            app: './src/index.tsx'  /* 入口文件模块路径 */
        },
        output: {
            path: path.join(__dirname, './dist/'),      /* 出口文件模块所属目录，必须是一个绝对路径 */
            filename: 'bundle.js'                       /* 打包的结果文件名称 */
        },
        devServer: {
            // 配置webpack-dev-server的www目录
            contentBase: './dist',
            open: true,
            hot: true,
            port: 3300
        },
        plugins: [
            // 该插件可以把index.html打包到bundle.js文件所属目录，跟着bundle走
            // 同时也会自动在index.html中注入script引用链接，并且引用的资源名称，也取决于打包的文件名称
            new htmlWebpackPlugin({
                template: './index.html'
            })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        //注意：这里的顺序很重要，不要乱了顺序
                        'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.scss$/,
                    use: [
                        //注意：这里的顺序很重要，不要乱了顺序
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.less$/,
                    use: [
                        //注意：这里的顺序很重要，不要乱了顺序
                        'style-loader',
                        'css-loader',
                        'less-loader'
                    ]
                },
                {
                    test: /\.(jpg|png|gif|svg|jp?g|woff|woff2|ttf|eot|ico)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 0,
                                outputPath: "assests"
                            }
                        }
                    ]
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /(node_modules|bower_components)/,//排除掉node_module目录
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/env', '@babel/typescript'], //转码规则
                            plugins: [
                                "@babel/proposal-class-properties",
                                "@babel/proposal-object-rest-spread",
                                "transform-class-properties",
                                [
                                    "transform-react-jsx",
                                    {
                                        "pragma": "Ginkgo.createElement",
                                        "pragmaFrag": "Ginkgo.Fragment"
                                    }
                                ],
                                //"../../packages/babel-plugin-import-ginkgo",
                            ]
                        }
                    }
                }
            ]
        },
        resolve: {
            // 必须填写后缀名称,否则会 Module not found: Error: Can't resolve 错误
            // 后缀名称必须是 .xxx 否则会报各种 Module not found
            extensions: [
                '.ts', '.tsx', '.js', '.jsx'
            ]
        }
    };
};
