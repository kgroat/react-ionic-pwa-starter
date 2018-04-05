
import * as React from 'react'

import { validationResult, withSuccess, withWarning, withError } from './ValidationDisplay.scss'

type ValidationLevel = 'success' | 'info' | 'warning' | 'error'

interface Props {
  level?: ValidationLevel
  message?: string | JSX.Element
  errors?: string[]
  warnings?: string[]
  warningsHeader?: string
  className?: string
}

class Content extends React.Component<Props> {
  render () {
    const { level = 'info', message = '' } = this.props

    return (
      <div className={this.getClassName(level)}>
        {message}
        {this.renderErrors()}
        {this.renderWarnings()}
      </div>
    )
  }

  private renderErrors = () => {
    const { errors = [] } = this.props

    if (errors.length === 0) {
      return null
    }

    return (
      <ul>
        {
          errors.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))
        }
      </ul>
    )
  }

  private renderWarnings = () => {
    const { warnings = [], warningsHeader } = this.props

    if (warnings.length === 0) {
      return null
    }

    const warningsBody = (
      <ul key='warnings'>
        {
          warnings.map((err, idx) => (
            <li key={idx}>{err}</li>
          ))
        }
      </ul>
    )

    if (!warningsHeader) {
      return warningsBody
    }

    return [
      <p key='warningsHead'>{warningsHeader}</p>,
      warningsBody,
    ]
  }

  private getClassName = (level: ValidationLevel) => {
    const { className = '' } = this.props

    if (level === 'success') {
      return `${validationResult} ${withSuccess} ${className}`
    } else if (level === 'error') {
      return `${validationResult} ${withError} ${className}`
    } else if (level === 'warning') {
      return `${validationResult} ${withWarning} ${className}`
    } else {
      return `${validationResult} ${className}`
    }
  }
}

export default Content
