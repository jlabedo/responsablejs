var path = require('path')
process.env.NODE_PATH = path.join(__dirname, '../..')
require('module').Module._initPaths()

require('babel-register')({
  plugins: ['transform-runtime'],
  presets: ['es2015', 'stage-0']
})
require('./main.js')
