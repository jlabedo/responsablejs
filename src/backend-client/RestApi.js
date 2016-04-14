import superagent from 'superagent'
import invariant from 'invariant'

function formatUrl (base, path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path
  // Prepend `/api` to relative URL, to proxy to API server.
  return base + adjustedPath
}

function escapeRegExp (string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function _compilePattern (pattern) {
  let regexpSource = ''
  const paramNames = []
  const tokens = []

  let match
  let lastIndex = 0
  let matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)/g
  while ((match = matcher.exec(pattern))) {
    if (match.index !== lastIndex) {
      tokens.push(pattern.slice(lastIndex, match.index))
      regexpSource += escapeRegExp(pattern.slice(lastIndex, match.index))
    }

    if (match[1]) {
      regexpSource += '([^/]+)'
      paramNames.push(match[1])
    } else if (match[0] === '**') {
      regexpSource += '(.*)'
      paramNames.push('splat')
    } else if (match[0] === '*') {
      regexpSource += '(.*?)'
      paramNames.push('splat')
    } else if (match[0] === '(') {
      regexpSource += '(?:'
    } else if (match[0] === ')') {
      regexpSource += ')?'
    }

    tokens.push(match[0])

    lastIndex = matcher.lastIndex
  }

  if (lastIndex !== pattern.length) {
    tokens.push(pattern.slice(lastIndex, pattern.length))
    regexpSource += escapeRegExp(pattern.slice(lastIndex, pattern.length))
  }

  return {
    pattern,
    regexpSource,
    paramNames,
    tokens
  }
}

const CompiledPatternsCache = {}

export function compilePattern (pattern) {
  if (!(pattern in CompiledPatternsCache)) {
    CompiledPatternsCache[pattern] = _compilePattern(pattern)
  }

  return CompiledPatternsCache[pattern]
}

function formatPattern (pattern, params) {
  params = params || {}

  const { tokens } = compilePattern(pattern)
  let parenCount = 0
  let pathname = ''
  let splatIndex = 0

  let token, paramName, paramValue
  for (let i = 0, len = tokens.length; i < len; ++i) {
    token = tokens[i]

    if (token === '*' || token === '**') {
      paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat

      invariant(
        paramValue != null || parenCount > 0,
        'Missing splat #%s for path "%s"',
        splatIndex, pattern
      )

      if (paramValue != null) pathname += encodeURI(paramValue)
    } else if (token === '(') {
      parenCount += 1
    } else if (token === ')') {
      parenCount -= 1
    } else if (token.charAt(0) === ':') {
      paramName = token.substring(1)
      paramValue = params[paramName]

      invariant(
        paramValue != null || parenCount > 0,
        'Missing "%s" parameter for path "%s"',
        paramName, pattern
      )

      if (paramValue != null) pathname += encodeURIComponent(paramValue)
    } else {
      pathname += token
    }
  }

  return pathname.replace(/\/+/g, '/')
}

export default {
  baseUrl: '',
  get: function (endpoint, paramsAccessor) {
    return (data) => {
      const interpolatedEndpoint = formatPattern(endpoint, paramsAccessor(data))
      return new Promise((resolve, reject) => {
        const request = superagent.get(formatUrl(this.baseUrl, interpolatedEndpoint))

        if (data) {
          request.send(data)
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body))
      })
    }
  }
}
