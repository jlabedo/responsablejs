export default {
  get: (endpoint, paramsAccessor, serveFunc) => {
    return {
      endpoint,
      paramsAccessor,
      method: 'get',
      backendFunction: serveFunc
    }
  }
}
