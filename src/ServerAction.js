export default class ServerAction {
  constructor(opts) {
    this.name = opts.name;
    this.onLoad = opts.onLoad;
    this.onSuccess = opts.onSuccess;
    this.onFail = opts.onFail;
    this.stateKey = opts.stateKey;
    this.initialState = opts.initialState;
    this.serve = opts.serve;
  }

  generateReducers() {
    let reducers = {};
    reducers[this.name + '_REQUEST'] = {
      reducer: this.onLoad,
      stateKey : this.stateKey
    };
    reducers[this.name + '_SUCCESS'] = {
      reducer: this.onSuccess,
      stateKey : this.stateKey
    };
    reducers[this.name + '_FAILURE'] = {
      reducer: this.onFail,
      stateKey : this.stateKey
    };
    return reducers;
  }

  dispatch(_dispatch, data) {
    _dispatch({
      type: this.name + '_REQUEST',
      data
    });
    this.backendLoad(data).then(
      (result) => _dispatch({type: this.name + '_SUCCESS'}),
      (error) => _dispatch({type: this.name + '_FAILURE'})
    ).catch((error)=> {
      console.error('ServerAction ERROR:', error);
      _dispatch({type: this.name + '_FAILURE'});
    });
  }
}
