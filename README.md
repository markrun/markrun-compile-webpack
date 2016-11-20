# webpack-compiler

[![Build Status](https://api.travis-ci.org/markrun/webpack-compiler.svg)](https://travis-ci.org/markrun/webpack-compiler) [![NPM version](https://img.shields.io/npm/v/webpack-compiler.svg?style=flat)](https://npmjs.org/package/webpack-compiler) [![NPM downloads](http://img.shields.io/npm/dm/webpack-compiler.svg?style=flat)](https://npmjs.org/package/webpack-compiler)


```js
var path = require('path')
var webpackCompiler = require('webpack-compiler')

var output = webpackCompiler({
    filepath: path.join(__dirname, 'test/commonjs/index.js'),
    webpack: webpack,
    webpackConfig: {
        module: {
            loaders: [
                {
                    test: /\.css$/,
                    loader: "style!css"
                }
            ]
        }
    },
    content: fs.readFileSync(jspath).toString()
})
```
**output.code:** [test/commonjs/index.js.output.js](./test/commonjs/index.js.output.js)
**output.stats:**  http://webpack.github.io/docs/node.js-api.html#stats
**output.stats.compilation.fileDependencies:**
```js
[
    "/Users/nimo/Documents/git/markrun-compile-webpack/node_modules/css-loader/lib/css-base.js",
    "/Users/nimo/Documents/git/markrun-compile-webpack/node_modules/style-loader/addStyles.js",
    "/Users/nimo/Documents/git/markrun-compile-webpack/test/commonjs/a.css",
    "/Users/nimo/Documents/git/markrun-compile-webpack/test/commonjs/a.js",
    "/Users/nimo/Documents/git/markrun-compile-webpack/test/commonjs/b.js",
    "/Users/nimo/Documents/git/markrun-compile-webpack/test/commonjs/index.js"
]
```
