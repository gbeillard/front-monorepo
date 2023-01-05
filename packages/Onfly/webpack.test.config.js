// / <binding />
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./webpack.base.config')({
  cache: true,
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: 'index_dev.html',
      filename: 'index.html',
    }),
  ],
  output: {
    filename: '[name]-[chunkhash].js',
    path: `${__dirname}/Scripts/Dist/`,
    publicPath: '/Scripts/Dist/',
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          ecma: undefined,
          warnings: false,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
          safari10: false,
          output: {
            comments: false,
          },
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]|[\\/]Scripts[\\/]tipped[\\/]|[\\/]Scripts[\\/]bootstrap[\\/]|[\\/]Scripts[\\/]jqwidgets[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
});

module.exports = [config];
