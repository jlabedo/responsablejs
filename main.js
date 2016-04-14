process.env.NODE_PATH = __dirname
require('module').Module._initPaths()

require('babel-register')({
  plugins: ['transform-runtime'],
  presets: ['es2015', 'stage-0']
})
require('./test.js')
