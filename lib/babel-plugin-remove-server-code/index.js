'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;

  return {
    visitor: {
      CallExpression: function CallExpression(path) {
        if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'SERVER') {
          path.replaceWith(t.Identifier('undefined'));
        }
      }
    }
  };
};