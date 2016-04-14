import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore as _createStore, combineReducers } from 'redux'
import { ActionTypes } from 'redux/lib/createStore'

export default {
  storeKey: 'framework',
  actions: [],

  createStore: function () {
    const reducerMap = {}
    this.actions.forEach((action) => {
      let reducers = action.generateReducers()
      Object.assign(reducerMap, reducers)
    })

    const reducer = this.getReducerFromMap(reducerMap)

    let finalReducer = combineReducers({
      framework: reducer
    })
    this.store = _createStore(finalReducer)
    return this.store
  },

  getReducerFromMap: function (reducerMap) {
    function initState (state) {
      let uniqueAccessors = []
      Object.keys(reducerMap).forEach((key) => {
        let accessor = reducerMap[key].stateAccessor
        if (uniqueAccessors.indexOf(accessor) === -1) {
          uniqueAccessors.push(accessor)
          state = accessor.init(state)
        }
      })
      return state
    }
    return (state = {}, action) => {
      if (action.type === ActionTypes.INIT) {
        return initState(state)
      }
      let reducer = reducerMap[action.type]
      if (reducer) {
        // let key = reducer.stateKey;
        let previousState = reducer.stateAccessor.getState(state)
        let nextState = reducer.reducer(previousState, action)
        return reducer.stateAccessor.updateState(state, nextState)
      } else {
        return state
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
      <div>
        <h1>Hello</h1>
        <Provider store={this.createStore()} key='provider'>
          <div>
            <h2>We are in context provider</h2>
            {component}
          </div>
        </Provider>
      </div>
    , root)
  }
}
