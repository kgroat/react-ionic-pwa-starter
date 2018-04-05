
import * as React from 'react'
import { Route, RouteProps } from 'react-router'

import AuthGate from 'containers/AuthGate'

type Props = RouteProps

function AuthRoute ({ component, ...rest }: Props) {
  const Component = component!

  return (
    <Route {...rest} render={props => {
      return (
        <AuthGate location={props.location}>
          <Component {...props as any} />
        </AuthGate>
      )
    }} />
  )
}

export default AuthRoute
