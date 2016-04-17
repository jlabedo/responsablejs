import React, { Component } from 'react'
import {connect} from 'react-redux'
// import framework from './framework-client-static';
import framework from 'src/FrameworkClient'
import RestApi from 'src/backend/RestApi'

import actionToRegister from 'actions/serverAction'
import simpleAction from 'actions/simple'
import SayCoucou from './StaticComponent'

@connect((state) => ({
  counter: framework.getState(state).counter,
  state: state
}))
export default class MyComponent extends Component {
  onButtonClick = () => {
    actionToRegister.dispatch({id: 1})
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
