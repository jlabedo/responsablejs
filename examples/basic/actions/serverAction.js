import ServerAction from 'src/ServerAction'
import RestApi from 'src/backend/RestApi'
import StateAccessor from 'src/StateAccessor'

const widgets = new StateAccessor('widgets', {})

export default new ServerAction({
  name: 'ActionTest1',
  stateAccessor: widgets,
  serve: RestApi.get('/test/:id', (data) => ({ id: data.id }), SERVER((req, res) => {
    res.send('Response from actionToRegister (direct)')
  }))
})
