const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  watch: true,
  target: ['web'],
  mode: 'development',
  devtool: 'source-map',
  entry: {
    tailwind: './src/public/js/tailwind.ts',
    tw_elements: './src/public/js/tw_elements.ts',
    base: './src/public/js/base.ts',
    detail_event: './src/public/js/detail_event.ts',
    login: './src/public/js/login.ts',
    register: './src/public/js/register.ts',
    profile: './src/public/js/profile.ts',
    // index: {
    //     import: "./src/js/index.ts",
    // },
  },
  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: './js/[name].min.js',
    // clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new BrowserSyncPlugin({
      host: process.env.runOnDocker ? '0.0.0.0' : 'localhost',
      port: 4000,
      proxy: 'http://localhost:3000/',
      open: false,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.s?css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
  },
};
