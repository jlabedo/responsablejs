import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore as _createStore, combineReducers } from 'redux';

export default {
  storeKey: 'framework',
  actions: [],

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

  register: function (action) {
    this.actions.push(action);
    action._dispatch = this.store.dispatch;
  },

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
