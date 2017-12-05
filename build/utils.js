'use strict'
const chunk = require('lodash.chunk')
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const PrerenderSpaPlugin = require('prerender-spa-plugin')
const SitemapPlugin = require('sitemap-webpack-plugin').default
const movies = require('../src/data/movies.json')
const PAGE_NUM = 16

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {indentedSyntax: true}),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

// Generate url list for pre-render
exports.generateRenderPlugins = () => {
  let staticPaths = ['/']
  for (let i = 1; i <= Math.ceil(movies.length / PAGE_NUM); i++) {
    staticPaths.push(`/page/${i}`)
  }
  let ajaxPaths = movies.map(m => `/view/${m.id}`)
  let totalRoutes = ajaxPaths.length + staticPaths.length
  let chunkSize = 5
  let staticChunks = chunk(staticPaths, chunkSize)
  let ajaxChunks = chunk(ajaxPaths, chunkSize)
  let plugins = []
  let distPath = path.join(__dirname, '../dist')
  let progress = 0
  // staticChunks.forEach(c => {
  //   plugins.push(new PrerenderSpaPlugin(distPath, c, {
  //       maxAttempts: 5,
  //       navigationLocked: true,
  //       captureAfterTime: 2000,
  //       postProcessHtml (context) {
  //         console.log(`[PRE-RENDER] (${++progress} / ${totalRoutes}) ${context.route}`)
  //         return context.html
  //       }
  //     }
  //   ))
  // })
  // ajaxChunks.forEach(p => {
  //   plugins.push(new PrerenderSpaPlugin(distPath, p, {
  //       maxAttempts: 5,
  //       navigationLocked: true,
  //       captureAfterTime: 2000,
  //       captureAfterElementExists: '#view-movie',
  //       postProcessHtml (context) {
  //         console.log(`[PRE-RENDER] (${++progress} / ${totalRoutes}) ${context.route}`)
  //         return context.html
  //       }
  //     }
  //   ))
  // })
  // site map plugin
  plugins.push(new SitemapPlugin('https://movie.lz5z.com', [].concat(staticPaths, ajaxPaths), {
    lastMod: true,
    priority: '0.4',
    changeFreq: 'weekly'
  }))
  return plugins
}
