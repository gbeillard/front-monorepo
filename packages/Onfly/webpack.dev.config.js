const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const config = require('./webpack.base.config')({
  mode: 'development',
  output: {
    filename: 'app.js',
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index_dev.html',
    }),
  ],
  devServer: {
    hot: true,
    compress: true,
    port: 3000,
    host: 'sandbox.dev.onfly.io',
    disableHostCheck: true,
    historyApiFallback: true,
    publicPath: '/',
    open: true,
    openPage: 'https://sandbox.dev.onfly.io:3000',
    https: {
      key: fs.readFileSync('certs/_wildcard.dev.onfly.io-key.pem', 'utf-8'),
      cert: fs.readFileSync('certs/_wildcard.dev.onfly.io.pem', 'utf-8'),
    },
  },
});

module.exports = [config];
