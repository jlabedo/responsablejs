'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  get: function get(endpoint, paramsAccessor, serveFunc) {
    return {
      endpoint: endpoint,
      paramsAccessor: paramsAccessor,
      method: 'get',
      backendFunction: serveFunc
    };
  }
};