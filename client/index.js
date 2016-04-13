import React, { Component } from 'react';
import {connect} from 'react-redux';
// import framework from './framework-client-static';
import framework from '../src/FrameworkClient';
import { actionToRegister } from '../actions/test';

@connect(state => ({
  counter: framework.getState(state).increment,
  state: state
}))
class MyComponent extends Component {
  render() {
    console.log('Rendering MyComponent', this.props);
    const {counter} = this.props;
    return (<div>Counter: <span>{counter}</span></div>);
  }
}

framework.register(actionToRegister);
framework.render(<MyComponent/>);

setInterval(() => framework.actions.increment(), 1000);
