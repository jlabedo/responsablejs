import ServerAction from '../src/ServerAction';
import RestApi from '../src/backend/RestApi';

export const actionToRegister = new ServerAction({
  name: 'ActionTest1',
  initialState: {},
  stateKey: 'widgets',
  onLoad: (state, data) => ({...state, loading: true}),
  onSuccess: (sate, data) => ({...state, loading: false, results: data}),
  onFail: (state) => ({...state, loading: false, error: true}),
  serve: RestApi.get('/test/:id', (data) => ({ id: data.id }), (req, res) => {
    res.send('Response from actionToRegister (direct)');
  })
});
