var express = require('express')
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var HtmlWebpackPlugin = require('html-webpack-plugin')
import path from 'path'

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

  serve (entryPoint) {
    const publicPath = 'http://localhost:3000/'
    const app = this.app = express()
    const compiler = webpack({
      entry: path.join(__dirname, 'frontend-main.js'),
      output: {
        path: '/dist/',
        publicPath: publicPath,
        filename: 'bundle.js'
      },
      resolve: {
        // root: path.resolve(__dirname),
        alias: {'src/backend': 'src/backend-client', 'MAIN_COMPONENT_MODULE': entryPoint},
        modulesDirectories: ['.', 'node_modules'],
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
        ]
      },
      plugins: [
        new HtmlWebpackPlugin(),
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

    app.listen(3000, () => {
      console.log('listening on 3000')
    })
  }
}
