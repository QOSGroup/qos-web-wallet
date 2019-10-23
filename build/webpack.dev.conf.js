
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const config = merge(baseWebpackConfig, {
  entry: {
    'background': './background.js',
    'content': './content.js',
    'inject': './inject.js',
    'popup/popup': './popup/popup.js',
    'options/options': './options/options.js'
  }
})

module.exports = config
