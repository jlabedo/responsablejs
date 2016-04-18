export default function ({types: t}) {
  return {
    visitor: {
      CallExpression: function CallExpression (path) {
        if (t.isIdentifier(path.node.callee) && path.node.callee.name === 'SERVER') {
          path.replaceWith(t.Identifier('undefined'))
        }
      }
    }
  }
}
