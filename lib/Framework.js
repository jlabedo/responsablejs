'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var HtmlWebpackPlugin = require('html-webpack-plugin');


function stringify(obj) {
  var placeholder = '____PLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') {
      fns.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift();
  });
  return json;
};

function q(loader, query) {
  return loader + '?' + JSON.stringify(query);
}

var Framework = function () {
  function Framework() {
    _classCallCheck(this, Framework);

    this.router = express.Router();
    this.actions = [];
  }

  _createClass(Framework, [{
    key: 'register',
    value: function register(action) {
      this.actions.push(action);
      if (action.serve) {
        var serve = action.serve;

        this.router[serve.method](serve.endpoint, serve.backendFunction);
      }
    }
  }, {
    key: 'generateReducer',
    value: function generateReducer() {
      return function (reducerMap) {
        return function () {
          var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
          var action = arguments[1];

          var reducer = reducerMap[action.type];
          if (reducer) {
            var key = reducer.stateKey;
            var previousState = key ? state[key] : state;
            var nextState = reducer.reducer(previousState, action);
            if (nextState !== previousState) {
              if (key) {
                return _extends({}, state, _defineProperty({}, key, nextState));
              } else {
                return nextState;
              }
            } else {
              return state;
            }
          } else {
            return state;
          }
        };
      };
    }
  }, {
    key: 'generateJsFile',
    value: function generateJsFile() {
      var code = '';
      var reducerMap = {};
      this.actions.forEach(function (action) {
        var reducers = action.generateReducers();
        Object.assign(reducerMap, reducers);
      });
      code += 'var reducerMap = ' + stringify(reducerMap) + '\n';
      var reducer = this.generateReducer()(reducerMap);
      code += reducer.toString();

      console.log(code);
    }
  }, {
    key: 'serve',
    value: function serve(opts) {
      // const { port = 3000 } = opts
      var port = 3000;
      (0, _invariant2.default)(opts.entryPoint, 'An entryPoint must be passed to Framework.serve function');
      if (opts.actions) {
        global.SERVER = function (arg) {
          return arg;
        };
        var registerActions = require(opts.actions).default;
        registerActions(this);
        delete global.SERVER;
      }
      var publicPath = 'http://localhost:' + port + '/';
      var app = this.app = express();
      var compiler = webpack({
        entry: ['webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr', 'webpack/hot/only-dev-server', _path2.default.join(__dirname, 'frontend-main.js')],
        output: {
          path: '/dist/',
          publicPath: publicPath,
          filename: 'bundle.js'
        },
        resolve: {
          // root: path.resolve(__dirname),
          alias: {
            'src/backend': 'src/backend-client',
            'MAIN_COMPONENT_MODULE': opts.entryPoint,
            'ACTIONS_MODULE': opts.actions ? opts.actions : _path2.default.join(__dirname, '/emptyActionsModule.js')
          },
          modulesDirectories: ['.', 'node_modules'],
          extensions: ['', '.js', '.jsx']
        },
        module: {
          loaders: [{
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loaders: [q('react-hot'), q('babel', {
              cacheDirectory: true,
              plugins: ['transform-decorators-legacy', 'transform-runtime', _path2.default.join(__dirname, '/babel-plugin-remove-server-code')],
              presets: ['es2015', 'react', 'stage-0']
            })]
          }]
        },
        plugins: [new HtmlWebpackPlugin(), new webpack.HotModuleReplacementPlugin(), new webpack.ProvidePlugin({ 'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch' }), new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DEVTOOLS__: true // <-------- DISABLE redux-devtools HERE
        })]
      });

      app.use('/api', this.router);
      app.use(webpackDevMiddleware(compiler, {
        publicPath: publicPath,
        stats: true
      }));
      app.use(webpackHotMiddleware(compiler));

      app.listen(port, function () {
        console.log('listening on ' + port);
      });
    }
  }]);

  return Framework;
}();

exports.default = Framework;