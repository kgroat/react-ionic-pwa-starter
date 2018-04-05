
import * as React from 'react'
import Base from '../_Base'

class IonInput extends Base<JSXElements.IonInputAttributes, HTMLIonInputElement> {
  unsafeProps = {
    onIonBlur: 'ionBlur',
    onIonFocus: 'ionFocus',
    onIonInput: 'ionInput',
    onIonInputDidLoad: 'ionInputDidLoad',
    onIonInputDidUnload: 'ionInputDidUnload',
    onIonStyle: 'ionStyle',
  }

  render () {
    return (
      <ion-input {...this.refProps} />
    )
  }
}

export default IonInput
