
import * as React from 'react'
import ErrorBoundary from 'components/ErrorBoundary'

export default ({ children }) => (
  <ErrorBoundary>
    {children}
  </ErrorBoundary>
)
