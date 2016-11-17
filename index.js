var deasync = require('deasync')
var MemoryFS = require("memory-fs")
var ProxyFileSystem = require('proxy-fs')
var path = require('path')
var mfs = new MemoryFS()
var extend = require('extend')
/*
 * @param {object} settings
 * @param {string} settings.filepath  "/user/nimo/Document/some/a.js"
 * @param {object} settings.webpackConfig
 * @param {string} settings.content `console.log(1)`
 * @return {string}
 */
var compile = deasync(function (props, callback) {
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

    var compiler = props.webpack(webpackConfig)
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
        callback(null ,mfs.data['output.js'].toString())
    })
})

/*
 * @param {Object} props.webpackConfig
 * @param {String} props.filepath "/user/nimo/Document/some/a.js"
 * @param {npm package} webpack
 */
module.exports = function (props) {
    return function(source, data) {
        // TODO: return fileDependencies map
        return {
            lang: 'js',

            code: compile(
                extend(
                    true,
                    props,
                    {
                        content: source
                    }
                )
            )
        }
    }
}
