var webpack = require('webpack')
var webpackCompiler = require('../index')
var path = require('path')
var fs = require('fs')
var assert = require('assert')

describe('commonjs.js', function() {
    describe('require', function() {
        it('should return a.js b.js', function() {
            var jspath = path.join(__dirname, 'commonjs', 'index.js')
            var output = webpackCompiler({
                filepath: jspath,
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
            // fs.writeFileSync(jspath + '.output.js', output.code)
            assert.equal(output.code, fs.readFileSync(jspath + '.output.js').toString())
            assert.equal(Array.isArray(output.stats.compilation.fileDependencies), true)
        })
    })
})
