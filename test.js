import path from 'path'
import Framework from './lib/Framework'
// import { actionToRegister } from './actions/serverAction'
// import registerActions from './actions'

const framework = new Framework()

// registerActions(framework)
// framework.registerActionsDirectory('./actions')
framework.serve(path.join(__dirname, 'client'), path.join(__dirname, 'actions'))
