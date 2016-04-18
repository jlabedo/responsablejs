// import framework from 'src/Framework'
import serverAction from './serverAction'
import simpleAction from './simple'

export default (framework) => {
  framework.register(serverAction)
  framework.register(simpleAction)
}

export {serverAction, simpleAction}
