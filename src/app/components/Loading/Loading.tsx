
import * as React from 'react'

import Spinner from 'components/Spinner'

import { loading } from './Loading.scss'

export default () => (
  <div className={loading}>
    <ion-spinner color='primary' />
  </div>
)
