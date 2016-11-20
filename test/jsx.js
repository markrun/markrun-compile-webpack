var webpack = require('webpack')
var webpackCompiler = require('../index')
var path = require('path')
var fs = require('fs')
var assert = require('assert')

describe('jsx.js', function() {
    describe('jsx', function() {
        it('should return react.creatElement', function() {
            var jspath = path.join(__dirname, 'jsx', 'index.js')
            var output = webpackCompiler({
                filepath: jspath,
                webpack: webpack,
                webpackConfig: {
                    module: {
                        loaders: [
                            {
                                 test: /\.js$/,
                                 loader: 'jsx-loader'
                            }
                        ]
                    }
                },
                content: fs.readFileSync(jspath).toString()
            })
            assert.equal(output.code, fs.readFileSync(jspath + '.output.js').toString())
        })
    })
})
