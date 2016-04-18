import path from 'path'
import Framework from 'lib/Framework'

const framework = new Framework()
framework.serve(path.join(__dirname, 'client'), path.join(__dirname, 'actions'))
