const path = require('path');
const basePath = path.resolve(__dirname, 'src');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const stylelint = require('stylelint-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ImageminMozjpeg = require('imagemin-mozjpeg');

const enabledSourceMap = process.env.NODE_ENV !== 'production';

module.exports = {
  mode: 'production',
  entry: './src/js/main.js',
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, './dist/assets'),
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: miniCssExtractPlugin.loader,
          },
          // CSSを別ファイルに出力するため`style-loader`は無効化する
          // 別ファイルに出力せずにバンドル場合は`miniCssExtractPlugin`を無効化して`style-loader`を有効化する
          // {
          //  loader: 'style-loader',
          // },
          {
            loader: 'css-loader',
            options: {
              // CSS内のurl()メソッドを取り込む
              url: false,
              // ソースマップを利用する
              sourceMap: enabledSourceMap,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  // ベンダープレフィックスを自動付与する
                  ['autoprefixer', { grid: true }],
                  // コンパイル後にメディアクエリを纏める
                  ['postcss-sort-media-queries', { sort: 'desktop-first' }],
                  // 可能ならばIEで`display: flex`のバグが起こりにくい書き方に変換する
                  'postcss-flexbugs-fixes',
                  // コンパイル後のCSSを最適化する
                  ['cssnano', { autoprefixer: false }],
                ],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // dart-sassを利用する
              implementation: require('sass'),
              // ソースマップを利用する
              sourceMap: enabledSourceMap,
              sassOptions: {
                // dart-sassの処理速度を上げるために`fiber`を利用する
                fiber: require('fibers'),
                // コンパイル後のCSSの出力形式
                outputStyle: 'expanded',
              },
            },
          },
          {
            // Sassのglobを利用する
            loader: 'import-glob-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new miniCssExtractPlugin({
      filename: 'css/style.css',
      ignoreOrder: true,
    }),
    new stylelint({
      fix: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'src/img',
          to: 'img',
        },
      ],
    }),
    // 出力する画像を自動で圧縮する
    new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: {
        quality: '65-80',
      },
      gifsicle: {
        interlaced: false,
        optimizationLevel: 1,
        colors: 256,
      },
      svgo: {},
      plugins: [
        ImageminMozjpeg({
          quality: 85,
          progressive: true,
        }),
      ],
    }),
  ],
  // `source-map`タイプのソースマップを出力
  devtool: 'source-map',
  // `node_modules`を監視（watch）対象から除外
  watchOptions: {
    ignored: /node_modules/,
  },
  // IE11向けの指定
  target: ['web', 'es5'],
  resolve: {
    alias: {
      '~': basePath,
    },
  },
};
