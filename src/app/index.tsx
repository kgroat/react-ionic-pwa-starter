
import * as React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import '@ionic/core'

import App from 'containers/App'
import './serviceWorker'

const rootElement = document.getElementById('app')

let renderRoot = (Component) => {
  render(
    <AppContainer>
      <Component />
    </AppContainer>
  , rootElement)
}

if (module.hot) {
  module.hot.accept('containers/App', () => {
    renderRoot(require('containers/App').default)
  })
}

renderRoot(App)
