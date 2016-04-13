function stringify (obj) {
  var placeholder = '____PLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify(obj, function(key, value) {
    if (typeof value === 'function') {
      fns.push(value);
      return placeholder;
    }
    return value;
  }, 2);
  json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function(_) {
    return fns.shift();
  });
  return json;
};

export default class Framework {
  constructor(router) {
    this.router = router;
    this.actions = [];
  }

  registerAction(action) {
    this.actions.push(action);
    if(action.serve) {
      const { serve } = action;
      this.router[serve.method](serve.endpoint, serve.backendFunction);
    }
  }

  /**
  ** Not sure this one should be in Framework class
  **/
  get = (action, endpoint, paramsAccessor, backendFunction) => {
    console.log(action);
    this.actions.push(action);
    this.router.get(endpoint, backendFunction);
  }

  generateReducer() {
    return (reducerMap) => (state = {}, action) => {
      let reducer = reducerMap[action.type];
      if (reducer) {
        let key = reducer.stateKey;
        let previousState = key ? state[key] : state;
        let nextState = reducer.reducer(previousState, action);
        if (nextState !== previousState) {
          if (key) {
            return {...state, [key]: nextState};
          } else {
            return nextState;
          }
        } else {
          return state;
        }
      } else {
        return state;
      }
    }
  }

  generateJsFile() {
    let code = '';
    const reducerMap = {};
    this.actions.forEach(action => {
      let reducers = action.generateReducers();
      Object.assign(reducerMap, reducers);
    });
    code += 'var reducerMap = ' + stringify(reducerMap) + '\n';
    let reducer = this.generateReducer()(reducerMap);
    code += reducer.toString();

    console.log(code);
  }
}
