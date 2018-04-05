
import * as React from 'react'
import Base from '../_Base'

import './Toolbar.scss'

class IonToolbar extends Base<JSXElements.IonToolbarAttributes, HTMLIonToolbarElement> {
  unsafeProps = {}

  render () {
    return (
      <ion-toolbar {...this.refProps} />
    )
  }
}

export default IonToolbar
