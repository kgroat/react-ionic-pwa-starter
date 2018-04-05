
import * as React from 'react'
import Base from '../_Base'

type Props = JSXElements.IonRefresherAttributes

class IonRefresher extends Base<Props, HTMLIonRefresherElement> {
  unsafeProps = {
    onIonPull: 'ionPull',
    onIonRefresh: 'ionRefresh',
    onIonStart: 'ionStart',
  }

  render () {
    return (
      <ion-refresher {...this.refProps}>
        {this.props.children}
      </ion-refresher>
    )
  }
}

export default IonRefresher
