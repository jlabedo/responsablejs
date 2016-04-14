export default class ServerAction {
  constructor (opts) {
    this.name = opts.name
    this.onLoad = opts.onLoad
    this.onSuccess = opts.onSuccess
    this.onFail = opts.onFail
    this.stateAccessor = opts.stateAccessor
    this.serve = opts.serve
  }

  generateReducers = () => {
    let reducers = {}
    reducers[this.name + '_REQUEST'] = {
      reducer: this.onLoad,
      stateAccessor: this.stateAccessor
    }
    reducers[this.name + '_SUCCESS'] = {
      reducer: this.onSuccess,
      stateAccessor: this.stateAccessor
    }
    reducers[this.name + '_FAILURE'] = {
      reducer: this.onFail,
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
