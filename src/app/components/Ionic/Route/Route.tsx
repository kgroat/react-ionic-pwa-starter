
import * as React from 'react'
import Base from '../_Base'

type Props<P> = JSXElements.IonRouteAttributes & {
  url: string
  component?: React.ComponentType<P> | string
  componentProps?: P,
}

class IonRoute<P = {}> extends Base<Props<P>, HTMLIonRouteElement> {
  unsafeProps = {
    onIonRouteDataChanged: 'ionRouteDataChanged',
  }

  render () {
    return (
      <ion-route {...this.refProps} />
    )
  }
}

export default IonRoute
