'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compilePattern = compilePattern;

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function formatUrl(base, path) {
  var adjustedPath = path[0] !== '/' ? '/' + path : path;
  // Prepend `/api` to relative URL, to proxy to API server.
  return base + adjustedPath;
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function _compilePattern(pattern) {
  var regexpSource = '';
  var paramNames = [];
  var tokens = [];

  var match = void 0;
  var lastIndex = 0;
  var matcher = /:([a-zA-Z_$][a-zA-Z0-9_$]*)|\*\*|\*|\(|\)/g;
  while (match = matcher.exec(pattern)) {
    if (match.index !== lastIndex) {
      tokens.push(pattern.slice(lastIndex, match.index));
      regexpSource += escapeRegExp(pattern.slice(lastIndex, match.index));
    }

    if (match[1]) {
      regexpSource += '([^/]+)';
      paramNames.push(match[1]);
    } else if (match[0] === '**') {
      regexpSource += '(.*)';
      paramNames.push('splat');
    } else if (match[0] === '*') {
      regexpSource += '(.*?)';
      paramNames.push('splat');
    } else if (match[0] === '(') {
      regexpSource += '(?:';
    } else if (match[0] === ')') {
      regexpSource += ')?';
    }

    tokens.push(match[0]);

    lastIndex = matcher.lastIndex;
  }

  if (lastIndex !== pattern.length) {
    tokens.push(pattern.slice(lastIndex, pattern.length));
    regexpSource += escapeRegExp(pattern.slice(lastIndex, pattern.length));
  }

  return {
    pattern: pattern,
    regexpSource: regexpSource,
    paramNames: paramNames,
    tokens: tokens
  };
}

var CompiledPatternsCache = {};

function compilePattern(pattern) {
  if (!(pattern in CompiledPatternsCache)) {
    CompiledPatternsCache[pattern] = _compilePattern(pattern);
  }

  return CompiledPatternsCache[pattern];
}

function formatPattern(pattern, params) {
  params = params || {};

  var _compilePattern2 = compilePattern(pattern);

  var tokens = _compilePattern2.tokens;

  var parenCount = 0;
  var pathname = '';
  var splatIndex = 0;

  var token = void 0,
      paramName = void 0,
      paramValue = void 0;
  for (var i = 0, len = tokens.length; i < len; ++i) {
    token = tokens[i];

    if (token === '*' || token === '**') {
      paramValue = Array.isArray(params.splat) ? params.splat[splatIndex++] : params.splat;

      (0, _invariant2.default)(paramValue != null || parenCount > 0, 'Missing splat #%s for path "%s"', splatIndex, pattern);

      if (paramValue != null) pathname += encodeURI(paramValue);
    } else if (token === '(') {
      parenCount += 1;
    } else if (token === ')') {
      parenCount -= 1;
    } else if (token.charAt(0) === ':') {
      paramName = token.substring(1);
      paramValue = params[paramName];

      (0, _invariant2.default)(paramValue != null || parenCount > 0, 'Missing "%s" parameter for path "%s"', paramName, pattern);

      if (paramValue != null) pathname += encodeURIComponent(paramValue);
    } else {
      pathname += token;
    }
  }

  return pathname.replace(/\/+/g, '/');
}

exports.default = {
  baseUrl: '',
  get: function get(endpoint, paramsAccessor) {
    var _this = this;

    return function (data) {
      var interpolatedEndpoint = formatPattern(endpoint, paramsAccessor(data));
      return new Promise(function (resolve, reject) {
        var request = _superagent2.default.get(formatUrl(_this.baseUrl, interpolatedEndpoint));

        if (data) {
          request.send(data);
        }

        request.end(function (err) {
          var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

          var body = _ref.body;
          return err ? reject(body || err) : resolve(body);
        });
      });
    };
  }
};