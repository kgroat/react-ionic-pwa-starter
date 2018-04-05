
import * as React from 'react'
import { Delegate } from '../_React' // TODO: Replace with @ionic/react
import Base from '../_Base'

type Props<P> = JSXElements.IonNavAttributes & {
  root?: React.ComponentType<P>
  rootParams?: P,
}

class IonNav<P = {}> extends Base<Props<P>, HTMLIonNavElement> {
  unsafeProps = {
    onIonNavChanged: 'ionNavChanged',
    root: undefined,
    rootParams: undefined,
    delegate: undefined,
  }

  getStaticProps () {
    return {
      delegate: Delegate,
    }
  }

  render () {
    return (
      <ion-nav {...this.refProps} />
    )
  }
}

export default IonNav
