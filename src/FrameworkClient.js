import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore as _createStore, combineReducers } from 'redux'

export default {
  storeKey: 'framework',
  actions: [],

  createStore: function (initialState) {
    const reducerMap = {}
    this.actions.forEach((action) => {
      let reducers = action.generateReducers()
      Object.assign(reducerMap, reducers)
    })

    const reducer = this.getReducerFromMap(reducerMap)

    let finalReducer = combineReducers({
      framework: reducer
    })
    this.store = _createStore(finalReducer, initialState, window.devToolsExtension ? window.devToolsExtension() : undefined)
    return this.store
  },

  getReducerFromMap: function (reducerMap) {
    function defaultState (state) {
      let uniqueAccessors = []
      Object.keys(reducerMap).forEach((key) => {
        let accessor = reducerMap[key].stateAccessor
        if (uniqueAccessors.indexOf(accessor) === -1) {
          uniqueAccessors.push(accessor)
          state = accessor.defaultState(state)
          accessor.mapToGlobalState((globalState) => globalState.framework)
        }
      })
      return state
    }
    return (state = {}, action) => {
      let reducer = reducerMap[action.type]
      if (reducer) {
        // let key = reducer.stateKey;
        let previousState = reducer.stateAccessor.getState(state)
        let nextState = reducer.reducer(previousState, action)
        return reducer.stateAccessor.updateState(state, nextState)
      } else {
        return defaultState(state)
      }
    }
  },

  getState: (state) => state.framework,

  register: function (action) {
    const self = this
    self.actions.push(action)
    action._dispatch = function () { return self.store.dispatch.apply(self, arguments) }
  },

  render: function (component) {
    const root = document.createElement('div')
    document.body.appendChild(root)

    ReactDOM.render(
      <Provider store={this.createStore()} key='provider'>
        {component}
      </Provider>
    , root)
  }
}
