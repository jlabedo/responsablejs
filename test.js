// import path from 'path'
import Framework from './src/Framework'
// import { actionToRegister } from './actions/serverAction'
import registerActions from './actions'

const framework = new Framework()

registerActions(framework)
framework.serve('client/index.js')
