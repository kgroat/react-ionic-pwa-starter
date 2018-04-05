
import * as React from 'react'
import Base, { EventHandler } from '../_Base'

type Props = JSXElements.IonInfiniteScrollAttributes & {
  onIonInfinite: EventHandler<HTMLIonInfiniteScrollElement>
}

class IonInfiniteScroll extends Base<Props, HTMLIonInfiniteScrollElement> {
  unsafeProps = {
    onIonInfinite: 'ionInfinite',
  }

  render () {
    return (
      <ion-infinite-scroll {...this.refProps}>
        <ion-infinite-scroll-content />
      </ion-infinite-scroll>
    )
  }
}

export default IonInfiniteScroll
