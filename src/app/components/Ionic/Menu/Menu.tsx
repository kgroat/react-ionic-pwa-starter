
import * as React from 'react'
import Base from '../_Base'

type Props = JSXElements.IonMenuAttributes & {
  contentId: string,
}

class IonMenu extends Base<Props, HTMLIonMenuElement> {
  unsafeProps = {
    onIonClose: 'ionClose',
    onIonMenuChange: 'ionMenuChange',
    onIonOpen: 'ionOpen',
    contentId: undefined,
  }

  render () {
    return (
      <ion-menu {...this.refProps} />
    )
  }
}

export default IonMenu
