'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = 'VUE项目' // page title 默认页面标题

const port = '9870' //端口号

// All configuration item explanations can be find in https://cli.vuejs.org/config/


// CDN资源
const cdn = {
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    'element-ui': 'ELEMENT'
  },
  // externals 资源对应 css cdn地址
  css: [
    'https://cdn.jsdelivr.net/npm/element-ui@2.15.6/lib/theme-chalk/index.min.css'
  ],
  // externals 资源对应 JS cdn地址
  js: [
    'https://cdn.jsdelivr.net/npm/vue@2.6.10/dist/vue.js', // vue.js 是开发版本， vue.min.js 是生产版本
    'https://cdn.jsdelivr.net/npm/vue-router@3.0.2/dist/vue-router.min.js',
    'https://cdn.jsdelivr.net/npm/element-ui@2.15.6/lib/index.min.js'
  ]
}

module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false, // 打包成 web页面 使用，一般建议 false，不然会生成很多map文件
  // productionSourceMap: true, // 使用 electron 打包成 桌面应用 使用
  devServer: {
    disableHostCheck: true,
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
      // devtool: 'souce-map'
    }
  },
  chainWebpack(config) {
    // 引入CDN
    // 告诉webpack需要排除的依赖名称和挂载在window上的对象属性名称。
    config.set('externals', cdn.externals)
    // 这里的作用是在后面index.html页面中通过link，script标签加载这些cdn链接。
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      return args
    })
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config.when(process.env.NODE_ENV !== 'development', config => {
      config.plugin('ScriptExtHtmlWebpackPlugin').after('html')
        .use('script-ext-html-webpack-plugin', [{
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        }]).end()
      config
        .optimization.splitChunks({
          chunks: 'all',
          cacheGroups: {
            libs: {
              name: 'chunk-libs',
              test: /[\\/]node_modules[\\/]/,
              priority: 10,
              chunks: 'initial' // only package third parties that are initially dependent
            },
            elementUI: {
              name: 'chunk-elementUI', // split elementUI into a single package
              priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
              test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order-record-manage to adapt to cnpm
            },
            commons: {
              name: 'chunk-commons',
              test: resolve('src/components'), // can customize your rules
              minChunks: 3, //  minimum common number
              priority: 5,
              reuseExistingChunk: true
            }
          }
        })
      // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
      config.optimization.runtimeChunk('single')
    }
    )
  }
}
