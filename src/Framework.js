var express = require('express')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var HtmlWebpackPlugin = require('html-webpack-plugin')
import path from 'path'
import invariant from 'invariant'

function stringify (obj) {
  var placeholder = '____PLACEHOLDER____'
  var fns = []
  var json = JSON.stringify(obj, function (key, value) {
    if (typeof value === 'function') {
      fns.push(value)
      return placeholder
    }
    return value
  }, 2)
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
    return fns.shift()
  })
  return json
};

function q (loader, query) {
  return loader + '?' + JSON.stringify(query)
}

export default class Framework {
  constructor () {
    this.router = express.Router()
    this.actions = []
  }

  register (action) {
    this.actions.push(action)
    if (action.serve) {
      const { serve } = action
      this.router[serve.method](serve.endpoint, serve.backendFunction)
    }
  }

  generateReducer () {
    return (reducerMap) => (state = {}, action) => {
      let reducer = reducerMap[action.type]
      if (reducer) {
        let key = reducer.stateKey
        let previousState = key ? state[key] : state
        let nextState = reducer.reducer(previousState, action)
        if (nextState !== previousState) {
          if (key) {
            return {...state, [key]: nextState}
          } else {
            return nextState
          }
        } else {
          return state
        }
      } else {
        return state
      }
    }
  }

  generateJsFile () {
    let code = ''
    const reducerMap = {}
    this.actions.forEach((action) => {
      let reducers = action.generateReducers()
      Object.assign(reducerMap, reducers)
    })
    code += 'var reducerMap = ' + stringify(reducerMap) + '\n'
    let reducer = this.generateReducer()(reducerMap)
    code += reducer.toString()

    console.log(code)
  }

  serve (opts) {
    // const { port = 3000 } = opts
    const port = 3000
    invariant(opts.entryPoint, 'An entryPoint must be passed to Framework.serve function')
    if (opts.actions) {
      global.SERVER = function (arg) { return arg }
      const registerActions = require(opts.actions).default
      registerActions(this)
      delete global.SERVER
    }
    const publicPath = `http://localhost:${port}/`
    const app = this.app = express()
    const compiler = webpack({
      entry: [
        'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr',
        'webpack/hot/only-dev-server',
        path.join(__dirname, 'frontend-main.js')
      ],
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
          'ACTIONS_MODULE': opts.actions ? opts.actions : path.join(__dirname, '/emptyActionsModule.js')
        },
        modulesDirectories: ['.', 'node_modules'],
        extensions: ['', '.js', '.jsx']
      },
      module: {
        loaders: [
          {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loaders: [
              q('react-hot'),
              q('babel', {
                cacheDirectory: true,
                plugins: ['transform-decorators-legacy', 'transform-runtime', path.join(__dirname, '/babel-plugin-remove-server-code')],
                presets: ['es2015', 'react', 'stage-0']
              })
            ]
          }
        ]
      },
      plugins: [
        new HtmlWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'}),
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
        })
      ]
    })

    app.use('/api', this.router)
    app.use(webpackDevMiddleware(compiler, {
      publicPath: publicPath,
      stats: true
    }))
    app.use(webpackHotMiddleware(compiler))

    app.listen(port, () => {
      console.log('listening on ' + port)
    })
  }
}
