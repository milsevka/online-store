const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const EslintPlugin = require('eslint-webpack-plugin');
const { merge } = require('webpack-merge');




const baseConfig = {
  mode: 'development',
  entry: {
    main: './index.ts',
  },
  context: path.join(__dirname, './src'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: '[file][ext]',
  },
  module: {
    rules: [
        {
            test: /\.[tj]s$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
            type: 'asset/resource',
            generator: {
                filename: './[path][name][ext]',
            },
          },
          {
            test: /\.(woff(2)?|eot|ttf|otf)$/i,
            type: 'asset/resource',
          },
          {
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader'],
          },
          {
            test: /\.s[ac]ss$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
          },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: './style.css' }),
    new HtmlWebpackPlugin({
        template: './index.html'
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
        patterns: [
            { from: './assets',
            to: path.join(__dirname, './dist/assets')},
            { from: './pages',
            to: path.join(__dirname, './dist/pages')},

        ]
    }),
    new EslintPlugin({ extensions: 'ts' }),
  ],
};

module.exports = ({ mode }) => {
  const isProductionMode = mode === 'prod';
  const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');

  return merge(baseConfig, envConfig);
};