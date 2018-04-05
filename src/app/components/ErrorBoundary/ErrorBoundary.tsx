import * as React from 'react'

export default class ErrorBoundary extends React.PureComponent {

  componentDidCatch (error) {
    if (__DEV__) {
      console.error('Error caught during react render:', error)
    }
  }

  render () {
    const { children } = this.props
    return React.Children.toArray(children)
  }
}
