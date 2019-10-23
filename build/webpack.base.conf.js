const webpack = require('webpack')
const ejs = require('ejs')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ExtensionReloader = require('webpack-extension-reloader')
const { VueLoaderPlugin } = require('vue-loader')
const { version } = require('../package.json')
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
const config = {
  mode: process.env.NODE_ENV,
  context: resolve('src'),
  entry: {
    'inject': './inject.js'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      '@': resolve('src')
    },
    modules: [
      'src',
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/images/',
          emitFile: false
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: '/fonts/',
          emitFile: false
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      global: 'window'
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CopyWebpackPlugin([
      { from: 'icons', to: 'icons', ignore: ['icon.xcf'] },
      { from: 'popup/popup.html', to: 'popup/popup.html', transform: transformHtml },
      { from: 'options/options.html', to: 'options/options.html', transform: transformHtml },
      {
        from: 'manifest.json',
        to: 'manifest.json',
        transform: (content) => {
          const jsonContent = JSON.parse(content)
          jsonContent.version = version

          if (config.mode === 'development') {
            jsonContent['content_security_policy'] = "script-src 'self' 'unsafe-eval'; object-src 'self'"
          }

          return JSON.stringify(jsonContent, null, 2)
        }
      }
    ])
  ],
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

if (config.mode === 'production') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ])
}

if (process.env.HMR === 'true') {
  config.plugins = (config.plugins || []).concat([
    new ExtensionReloader({
      manifest: resolve('/src/manifest.json')
    })
  ])
}

function transformHtml (content) {
  return ejs.render(content.toString(), {
    ...process.env
  })
}

module.exports = config
