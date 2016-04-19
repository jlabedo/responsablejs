import path from 'path'
import Framework from 'src/Framework'

const framework = new Framework()
framework.serve({
  entryPoint: path.join(__dirname, 'client'),
  actions: path.join(__dirname, 'actions')
})
