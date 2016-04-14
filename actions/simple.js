import SimpleAction from '../src/SimpleAction'
import StateAccessor from '../src/StateAccessor'

const counter = new StateAccessor('counter', 0)

export default new SimpleAction({
  name: 'INCREMENT',
  reducer: (state = 0) => state + 1,
  stateAccessor: counter
})
