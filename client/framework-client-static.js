import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore as _createStore, combineReducers } from 'redux';


var reducerMap = {
  "ActionTest1_REQUEST": {
    "reducer": function onLoad(state, data) {
    return _extends({}, state, { loading: true });
  },
    "stateKey": "widgets"
  },
  "ActionTest1_SUCCESS": {
    "reducer": function onSuccess(sate, data) {
    return _extends({}, state, { loading: false, results: data });
  },
    "stateKey": "widgets"
  },
  "ActionTest1_FAILURE": {
    "reducer": function onFail(state) {
    return _extends({}, state, { loading: false, error: true });
  },
    "stateKey": "widgets"
  },
  "INCREMENT": {
    "reducer": function increment() {
      var state = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
      return state + 1;
    },
    "stateKey": "increment"
  }
};

var reducer = function () {
  var state = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var action = arguments[1];

  var reducer = reducerMap[action.type];
  if (reducer) {
    var key = reducer.stateKey;
    var previousState = key ? state[key] : state;
    var nextState = reducer.reducer(previousState, action);
    if (nextState !== previousState) {
      if (key) {
        return _extends({}, state, _defineProperty({}, key, nextState));
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

export default {
  storeKey: 'framework',
  createStore: function () {
    let finalReducer = combineReducers({
      framework: reducer
    });
    this.store = _createStore(finalReducer);
    this.actions = {
      increment: () => {
        this.store.dispatch({type: 'INCREMENT'});
      }
    }
    return this.store;
  },
  getState: (state) => state.framework,
  render: function(component) {
    const root = document.createElement('div')
    document.body.appendChild(root)

    ReactDOM.render(
      <div>
        <h1>Hello</h1>
        <Provider store={this.createStore()} key='provider'>
          <div>
            <h2>We are in context provider</h2>
            {component}
          </div>
        </Provider>
      </div>
    , root);
  }
};
