import superagent from 'superagent'

function formatUrl (base, path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path
  // Prepend `/api` to relative URL, to proxy to API server.
  return base + adjustedPath
}

export default {
  baseUrl: '',
  get: function (endpoint, paramsAccessor) {
    return (data) => {
      return new Promise((resolve, reject) => {
        const request = superagent.get(formatUrl(this.baseUrl, endpoint))

        if (data) {
          request.send(data)
        }

        request.end((err, { body } = {}) => err ? reject(body || err) : resolve(body))
      })
    }
  }
}
