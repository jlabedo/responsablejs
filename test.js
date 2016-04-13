var path = require('path');
var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require("webpack-dev-middleware");
var HtmlWebpackPlugin = require('html-webpack-plugin');
import Framework, { restAPI } from './src/Framework';
import ServerAction from './src/ServerAction';
import { actionToRegister } from './actions/test';

var publicPath = 'http://localhost:3000/';
var app = express();
const framework = new Framework(express.Router());

// actionToRegister.serve((req, res) => {
//   res.send('Action to register response');
// });

framework.registerAction(actionToRegister);
// framework.generateJsFile();

app.use('/api',framework.router);

var compiler = webpack({
  entry: __dirname + '/client/index.js',
  output: {
    path: '/dist/',
    publicPath: publicPath,
    filename: 'bundle.js'
  },
  resolve: {
    modulesDirectories: ['node_modules', '.'],
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      // the optional 'runtime' transformer tells babel to require the runtime
      // instead of inlining it.
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          cacheDirectory: true,
          plugins: ['transform-decorators-legacy', 'transform-runtime'],
          presets: ['es2015', 'react', 'stage-0']
        }
      }
    ],
  },
  plugins: [new HtmlWebpackPlugin()]
});

app.use(webpackDevMiddleware(compiler, {
    publicPath: publicPath,
    stats: true
}));

app.listen(3000,() => {
  console.log('listening on 3000');
});
