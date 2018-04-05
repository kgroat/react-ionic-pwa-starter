
import * as React from 'react'
import '@ionic/core'

abstract class IonBase<Props extends HTMLAttributes & object, TElement extends HTMLElement> extends React.Component<Props> {
  protected get refProps (): React.Props<TElement> & Props {
    return Object.assign({}, this.props, {
      ref: this.setRef,
    })
  }

  element: TElement

  protected abstract readonly unsafeProps: { [P in keyof Partial<Props>]: string | undefined }

  componentDidUpdate (prevProps: Props) {
    this.applyProps(this.props, prevProps)
  }

  protected getStaticProps (): Partial<Props> {
    return {}
  }

  private setRef = (ref) => {
    this.element = ref
    this.applyProps(this.props)
  }

  private applyProps = (props: Props, prevProps?: Props) => {
    const staticProps = this.getStaticProps()
    props = Object.assign({}, props, staticProps)
    if (this.element) {
      Object.keys(this.unsafeProps).forEach((key: keyof Props) => {
        const eventName: string | undefined = this.unsafeProps[key]
        if (eventName) {
          if (prevProps && prevProps[key] && props[key] !== prevProps[key]) {
            this.element.removeEventListener(eventName, prevProps[key] as any)
            this.element.addEventListener(eventName, props[key] as any)
          } else if (props[key]) {
            this.element.addEventListener(eventName, props[key] as any)
          }
        } else {
          this.element[key as string] = props[key]
        }
      })
    }
  }
}

export interface EventHandler<T extends HTMLElement> {
  (event: CustomEvent & { currentTarget: T }): void
}

export default IonBase
