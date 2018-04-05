
import * as React from 'react'

import { spinner, path } from './Spinner.scss'

export interface Props {
  className?: string
  style?: React.CSSProperties
}

export default class Spinner extends React.Component<Props> {
  render () {
    const { className = '', style } = this.props

    return (
      <svg className={`${spinner} ${className}`} viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' style={style}>
        <circle className={path} fill='none' strokeWidth={10} strokeLinecap='round' cx={50} cy={50} r={45} />
      </svg>
    )
  }
}
