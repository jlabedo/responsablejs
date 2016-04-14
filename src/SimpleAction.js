export default class ServerAction {
  constructor (opts) {
    this.name = opts.name
    this.reducer = opts.reducer
    this.stateAccessor = opts.stateAccessor
    this.initialState = opts.initialState
  }

  generateReducers = () => {
    let self = this
    return {
      [this.name]: {
        reducer: self.reducer,
        stateAccessor: self.stateAccessor
      }
    }
  }

  dispatch = (data) => {
    if (!this._dispatch) {
      console.error('No dispatch method has been registered', this)
    }
    this._dispatch({
      type: this.name,
      data
    })
  }
}
