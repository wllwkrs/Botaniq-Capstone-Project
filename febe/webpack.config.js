const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pages = [
  'beranda',
  'detail-kebun',
  'home',
  'login',
  'manajemen-kebun',
  'profile-revisi',
  'register',
  'rekomendasi'
];

module.exports = {
  entry: pages.reduce((entries, page) => {
    entries[page] = `./src/js/${page}.js`;
    return entries;
  }, {}),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  plugins: [
    ...pages.map(page =>
      new HtmlWebpackPlugin({
        filename: `${page}.html`,
        template: `./src/html/${page}.html`,
        chunks: [page],
      })
    ),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/img', to: 'assets/img' }
      ],
    }),
    new MiniCssExtractPlugin({
    filename: 'assets/css/[name].css',
  }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      serveIndex: true,
    },
    port: 8080,
    open: true,
    historyApiFallback: {
      index: '/home.html',
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          sources: {
            list: [
              '...',
              {
                tag: 'img',
                attribute: 'src',
                type: 'src',
              },
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name][ext]',
        },
      },
    ],
  },
  mode: 'development',
};
