### 如何在项目中配置 babel

#### webpack 编译流程

```
{
      test: /\.(j|t)sx?$/,
      include: paths.appSrc,
      exclude: /node_modules/,
      loader: require.resolve('babel-loader')
}
```



```
// .babelrc
module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {},
                useBuiltIns: 'usage',
                corejs: 3
            }
        ],
        '@babel/preset-typescript',
        '@babel/preset-react'
    ],
    plugins: [
        'react-hot-loader/babel',
        '@babel/plugin-transform-runtime',
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-syntax-dynamic-import',
        [
            'import',
            {
                libraryName: 'antd',
                libraryDirectory: 'es',
                style: true
            }
        ]
    ]
};

```
