var path = require('path');
const webpack = require('webpack'); // 用于访问内置插件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 通过 npm 安装
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var ProgressBarPlugin = require('progress-bar-webpack-plugin');


module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'index_bundle.js'
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({ template: './index.html' }),
        new ProgressBarPlugin(),
    ],

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"],
        alias: {
            '@': path.join(__dirname, './src')
        },
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            
            // css
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader',],
              },
              {
                test: /\.less$/,
                use: [
                  { loader: 'style-loader' },
                  { loader: 'css-loader' },
                  {
                    loader: "postcss-loader",
                    options: {
                      plugins: [
                        require('autoprefixer')({
                          browsers: ['last 5 version']
                        })
                      ]
                    }
                  },
                  // javascriptEnabled: true  ------  在less里面可以使用JavaScript表达式
                  { loader: 'less-loader', options: { javascriptEnabled: true } },
                ],
                // 切记这个地方一定要引入antd，文档上没有写入但是一定要因引进去，切记切记
                include: [/antd/],
              },
              {
                test: /\.less$/,
                use: [
                  'style-loader',
                  {
                    loader: 'css-loader',
                    options: {
                      modules: true,
                      sourceMap: true,
                      localIdentName: '[name]__[local]--[hash:base64:5]',
                    },
                  },
                  {
                    loader: "postcss-loader",
                    options: {
                      plugins: [
                        require('autoprefixer')({
                          browsers: ['last 5 version']
                        })
                      ]
                    }
                  },
                  { loader: 'less-loader', options: { javascriptEnabled: true } },
                ],
                exclude: [/antd/],
            },
        ]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    }
};
