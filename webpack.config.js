const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
      { test: /\.vue$/, use: 'vue-loader' },
      {
        test: /\.pug$/,
        use: 'pug-plain-loader'
      },
      {
        test: /\.(c|le)ss$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader']
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.vue', '.css', '.less']
  },

  devtool: 'source-map',

  devServer: {
    open: true,
    hot: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
}
