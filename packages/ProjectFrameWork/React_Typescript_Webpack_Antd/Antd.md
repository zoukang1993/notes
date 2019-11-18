## Antd

### 部署　css less sass
```
npm install extract-text-webpack-plugin
npm install style-loader css-loader postcss-loader autoprefixer --save-dev
npm install less sass less-loader sass-loader stylus-loader node-sass --save-dev
```

----

### antd
> yarn add antd

#### 按需加载组件代码和样式
yarn add babel-plugin-import

.babelrc
```
{
  "presets": [
    "react",
    "env"
  ],
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd",
        "libraryDirectory": "lib",
        "style": true
      }
    ]
  ]
}
```

##### loader
```
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
```
------