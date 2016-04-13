/**
** Example file
**/

/**
** server provide automatic rest points
** server builds a state reducer and fetch rest points automaticaly
** server needs to know about rest points, calling actions, and state reducer
** client need to know only about actions --> this is where webpack transforms should act
** webpack transform :
**      1) state reducer
**      2) action creators
**/
export class MyBackend extends Backend {
  loadUsers(data) {
    return Backend.restAPI.get('/test/:id', { id: data.id }, () => {
      return db.exec("SELECT * from Users");
    })
  }
}

class ServerAction extends Action {
  constructor(opts) {
    this.name = opts.name;
    this.onLoad = opts.onLoad;
    this.onSuccess = opts.onSuccess;
    this.onFail = opts.onFail;
    this.mapState = opts.mapState;
    this.initialState = opts.initialState;
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

let actionToRegister = new ServerAction({
  name: 'ActionTest1',
  initialState: {},
  mapState: (state) => state.widgets,
  onLoad: (state, data) => {...state, loading: true},
  onSuccess: (sate, data) => {...state, loading: false, results: data},
  onFail: {...state, loading: false, error: true},
  backendLoad: importedBackend.restAPI.get('/test/:id', (data) => { id: data.id }, () => {
    return db.exec("SELECT * from Users");
  });
});


function reducer(state, action) {
  let actionReducer = someGlobalVar.get(action);
  if(actionReducer) {
    return actionReducer(state, action);
  } else {
    return state;
  }
}
