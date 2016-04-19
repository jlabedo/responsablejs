import SimpleAction from 'src/SimpleAction'
import StateAccessor from 'src/StateAccessor'

export const accessor = new StateAccessor('counter', 0)

export default new SimpleAction({
  name: 'INCREMENT',
  reducer: (state, action) => state + 1,
  stateAccessor: accessor
})
