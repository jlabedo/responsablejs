require('babel-register')({
  plugins: ['transform-runtime'],
  presets: ['es2015', 'stage-0']
});
require('./test.js');
