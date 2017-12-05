const path = require('path')
const loadMinified = require('../build/load-minified')
const config = require('./index')
const IS_PROD = process.env.NODE_ENV === 'production'
const filename = IS_PROD ? config.build.index: 'index.html'
const template = 'index.html'
const inject = 'head'
const minify = {
  removeComments: true,
  collapseWhitespace: IS_PROD ? true : false,
  removeAttributeQuotes: false,
  minifyJS: IS_PROD ? true : false,
}
const chunksSortMode = IS_PROD ? 'dependency' : 'auto'
const serviceWorkerProdLoader = `<script>${loadMinified(path.join(__dirname,
  '../build/service-worker-prod.js'))}</script>`
const serviceWorkerDevLoader = `<script>${loadMinified(path.join(__dirname,
  '../build/service-worker-dev.js'))}</script>`

const serviceWorkerLoader = IS_PROD ? serviceWorkerProdLoader: serviceWorkerDevLoader

module.exports = {
  'index': {
    params: {
      filename,
      template,
      inject,
      minify,
      chunksSortMode,
      serviceWorkerLoader
    }
  },
  '404': {
    params: {
      filename: '404.html',
      template,
      inject,
      minify,
      chunksSortMode,
      serviceWorkerLoader
    }
  }
}
