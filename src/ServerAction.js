export default class ServerAction {
  constructor (opts) {
    this.name = opts.name
    if (opts.onLoad) this.onLoad = opts.onLoad
    if (opts.onSuccess) this.onSuccess = opts.onSuccess
    if (opts.onFail) this.onFail = opts.onFail
    this.stateAccessor = opts.stateAccessor
    this.serve = opts.serve
  }

  onLoad = (state, action) => ({...state, loading: true})
  onSuccess = (state, result) => ({...state, loading: false, results: result})
  onFail = (state, error) => ({...state, loading: false, error: true})

  generateReducers = () => {
    let reducers = {}
    reducers[this.name + '_REQUEST'] = {
      reducer: this.onLoad,
      stateAccessor: this.stateAccessor
    }
    reducers[this.name + '_SUCCESS'] = {
      reducer: (state, action) => this.onSuccess(state, action.result),
      stateAccessor: this.stateAccessor
    }
    reducers[this.name + '_FAILURE'] = {
      reducer: (state, action) => this.onFail(state, action.error),
      stateAccessor: this.stateAccessor
    }
    return reducers
  }

  dispatch = (data) => {
    if (!this._dispatch) {
      console.error('No dispatch method has been registered', this)
    }
    const _d = this._dispatch
    _d({
      type: this.name + '_REQUEST',
      data
    })
    this.serve(data).then(
      (result) => _d({type: this.name + '_SUCCESS', result}),
      (error) => _d({type: this.name + '_FAILURE', error})
    ).catch((error) => {
      console.error('ServerAction ERROR:', error)
      _d({type: this.name + '_FAILURE', error})
    })
  }
}
