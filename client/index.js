import React, { Component } from 'react'
import {connect} from 'react-redux'
// import framework from './framework-client-static';
import framework from 'src/FrameworkClient'
// import RestApi from 'src/backend/RestApi'
import actionToRegister from 'actions/serverAction'
// import simpleAction from 'actions/simple'

@connect((state) => ({
  counter: framework.getState(state).counter,
  state: state
}))
export default class MyComponent extends Component {
  render () {
    console.log('Rendering MyComponent', this.props)
    const {counter} = this.props
    return (
      <div>
        Counter: <span>{counter}</span>
        <button onClick={actionToRegister.dispatch}>Trigger server action</button>
      </div>
    )
  }
}
// RestApi.baseUrl = '/api'
// framework.register(simpleAction)
// framework.register(actionToRegister)
// framework.render(<MyComponent/>)

// setInterval(() => simpleAction.dispatch(), 10000);
