const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');


module.exports = {
  entry: {
    index: path.join(__dirname, './test/index.ts')
  },
  context: __dirname,
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      '@hearo': path.resolve(__dirname, './src/')
    }
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new ErrorOverlayPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      },
    ]
  },
  output: {
    filename: '[name].[contenthash].js',
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9696
  }
};
