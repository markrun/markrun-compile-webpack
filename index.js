var path = require('path')

var deasync = require('deasync')
var MemoryFS = require("memory-fs")
var ProxyFileSystem = require('proxy-fs')
var extend = require('extend')

var mfs = new MemoryFS()
/*
 * @param {object} settings
 * @param {string} settings.filepath  "/user/nimo/Document/some/a.js"
 * @param {object} settings.webpackConfig
 * @param {string} settings.content `console.log(1)`
 * @return {string}
 */
var compile = deasync(function (settings, callback) {
    if (typeof settings.content !== 'string') {
        throw new Error('settings.content need to be a string')
    }
    settings.webpackConfig = settings.webpackConfig || {}
    var webpackConfig = extend(true, {
        hash: false,
        timings: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        children: true,
        version: true,
        cached: false,
        cachedAssets: false,
        reasons: false,
        source: false,
        errorDetails: false
    }, settings.webpackConfig)
    webpackConfig.entry = settings.filepath
    webpackConfig.output = webpackConfig.output || {}
    webpackConfig.output.path = '/'
    webpackConfig.output.filename = 'output.js'

    mfs.mkdirpSync(path.dirname(settings.filepath))
    mfs.writeFileSync(settings.filepath, settings.content)

    var compiler = settings.webpack(webpackConfig)
    compiler.inputFileSystem = new ProxyFileSystem(function (readpath) {
        if (readpath == settings.filepath) {
            return {
                path: readpath,
                fileSystem: mfs
            }
        }
    })
    compiler.outputFileSystem = mfs
    compiler.run(function(err, stats) {
        if (err) {
            console.log(err)
            return
        }
        if (stats.hasErrors()) {
            console.log(stats.compilation ? stats.compilation.errors : null)
            return
        }
        // 输出
        callback(null ,{
            code: mfs.data['output.js'].toString(),
            stats: stats
        })
    })
})
module.exports = compile
