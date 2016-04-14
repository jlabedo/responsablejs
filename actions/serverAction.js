import ServerAction from 'src/ServerAction'
import RestApi from 'src/backend/RestApi'
import StateAccessor from 'src/StateAccessor'

const widgets = new StateAccessor('widgets', {})

export default new ServerAction({
  name: 'ActionTest1',
  stateAccessor: widgets,
  onLoad: (state, data) => ({...state, loading: true}),
  onSuccess: (state, data) => ({...state, loading: false, results: data}),
  onFail: (state) => ({...state, loading: false, error: true}),
  serve: RestApi.get('/test/:id', (data) => ({ id: data.id }), (req, res) => {
    res.send('Response from actionToRegister (direct)')
  })
})
