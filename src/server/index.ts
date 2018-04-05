
import 'dotenv/config'
import app from './server'
import { getDb } from 'services/dbService'

function startServer () {
  const httpServer = app.listen(app.get('port'), (error) => {
    if (error) {
      console.error(error)
    } else {
      const address = httpServer.address()
      console.info(`==> Listening on ${address.port}.`)
    }
  })

  if (module.hot) {
    let currentApp = app
    module.hot.accept('./server', () => {
      httpServer.removeListener('request', currentApp)
      import('./server').then(m => {
        httpServer.on('request', m.default)
        currentApp = m.default
        console.log('Server reloaded!')
      })
      .catch(err => console.error(err))
    })

    module.hot.accept()
    module.hot.dispose(() => {
      console.log('Disposing entry module...')
      httpServer.close()
    })
  }
}

getDb()
  .then(startServer)
  .catch(err => {
    console.error('An error occurred when starting the app:')
    console.error(err)
    process.exit(1)
  })
