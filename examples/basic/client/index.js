import React, { Component } from 'react'
import {connect} from 'react-redux'
import framework from 'src/FrameworkClient'
import RestApi from 'src/backend/RestApi'

import serverAction from '../actions/serverAction'
import simpleAction, { accessor as counter} from '../actions/simple'
import SayCoucou from './StaticComponent'

import customReducer from './customReducer'

framework.externalReducers = {
  custom: customReducer
}

@connect((state) => ({
  counter: counter.getFromGlobalState(state),
  state: state
}))
export default class MyComponent extends Component {
  onButtonClick = () => {
    serverAction.dispatch({id: 1})
  }
  render () {
    const {counter} = this.props
    return (
      <div>
        <div>CounterCC: {counter}</div>
        <SayCoucou />
        <button onClick={this.onButtonClick}>Trigger server action</button>
      </div>
    )
  }
}
RestApi.baseUrl = '/api'
setInterval(simpleAction.dispatch, 1000)
