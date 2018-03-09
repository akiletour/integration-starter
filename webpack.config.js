const options = {
  path: {
    public: './public',
    src: './src'
  },
  isDevEnvironment: process.env.NODE_ENV !== 'production'
};

const glob = require('glob');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const ManifestPlugin = require('webpack-manifest-plugin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack');

const extractCSS = new ExtractTextPlugin({
  filename: 'main.css',
});

const config = {
  mode: options.isDevEnvironment ? 'development' : 'production',
  entry: {
    main: ['tether', `${options.path.src}/js/main.js`, `${options.path.src}/css/main.scss`]
  },
  // devtool: options.isDevEnvironment ? 'cheap-module-eval-source-map' : false,
  externals: {
    //jquery: jQuery
  },
  devServer: {
    contentBase: path.join(__dirname, "public"),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    },
    overlay: {
      warnings: true,
      errors: true
    },
  },
  output: {
    path: path.resolve(__dirname, options.path.public),
    filename: '[name].js',
    publicPath: options.isDevEnvironment ? 'http://localhost:8080/' : '/'
  },
  resolve: {
    extensions: ['.jsx', '.js'],
    alias: {
      '~': path.resolve('node_modules')
    }
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }, {
      test: /\.js$/,
      use: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.scss$/,
      use: extractCSS.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: !options.isDevEnvironment,
            sourceMap: options.isDevEnvironment
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: options.isDevEnvironment
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: options.isDevEnvironment
          }
        }]
      })
    }, {
      test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf|wav)(\?.*)?$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: `[name]${options.isDevEnvironment ? '' : '.[hash]'}.[ext]`,
          useRelativePath: !options.isDevEnvironment
        }
      }]
    }, {
      test: /\.html\.twig$/,
      use: 'twig-loader',
      exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      tether: 'tether',
      Tether: 'tether',
      Popper: ['popper.js', 'default'],
      'window.Tether': 'tether',
      Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
      Button: 'exports-loader?Button!bootstrap/js/dist/button',
      Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
      Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
      Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
      Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
      Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
      Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Util: 'exports-loader?Util!bootstrap/js/dist/util'
    }),
    extractCSS,
    new ImageminPlugin({
      disable: options.isDevEnvironment,
      pngquant: {
        quality: '95-100'
      },
      jpegtran: false,
      plugins: [
        imageminMozjpeg({
          quality: 90,
          progressive: true
        }),
      ]
    }),
  ]
}

glob.sync('src/html/*.html.twig').forEach(item => {
  config.plugins.push(new HtmlWebpackPlugin({
    template: item,
    filename: path.basename(item, '.twig')
  }));
});

if (options.isDevEnvironment) {
  config.plugins.push(new BundleAnalyzerPlugin({ openAnalyzer: false })); // Default port 8888
} else {
  config.plugins.push(new ManifestPlugin());
}

module.exports = config;
