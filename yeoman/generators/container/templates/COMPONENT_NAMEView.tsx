
import * as React from 'react'
import { connect, Store } from 'react-redux'
import { RouteComponentProps } from 'react-router'

import ContentView from 'containers/ContentView'

import { AppState } from 'state'

interface RouteParams {
}

interface OwnProps extends RouteComponentProps<RouteParams> {
  store?: Store<any>
}

type Props = OwnProps & StateProps & DispatchProps

export class COMPONENT_NAMEView extends React.Component<Props> {
  render () {
    return (
      <ContentView title='COMPONENT_NAME' padding>
        Hello, World!
      </ContentView>
    )
  }
}

interface StateProps {
}

interface DispatchProps {
}

const withRedux = connect<StateProps, DispatchProps, OwnProps, AppState>(
  (state) => ({
  }),
  (dispatch) => ({
  }),
)

const ConnectedCOMPONENT_NAMEView = withRedux(COMPONENT_NAMEView)

export default ConnectedCOMPONENT_NAMEView
