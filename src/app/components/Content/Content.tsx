
import * as React from 'react'

import Refresher from 'components/Ionic/Refresher'

import { refreshContent, padded } from './Content.scss'

interface Props {
  refresh?: () => Promise<any>
  padding?: boolean
  className?: string
}

class RefreshContent extends React.Component<Props> {
  refresher: Refresher

  render () {
    const { padding, refresh, className = '' } = this.props

    return (
      <ion-content class={`${refreshContent} ${className}`}>
        {
          refresh
          ? <Refresher ref={this.setRefresher} slot='fixed' onIonRefresh={this.refreshData}>
              <ion-refresher-content />
            </Refresher>
          : null
        }
        <ion-scroll class={padding ? padded : ''}>
          {this.props.children}
        </ion-scroll>
      </ion-content>
    )
  }

  private setRefresher = (ref) => {
    this.refresher = ref
  }

  private refreshData = async () => {
    const { refresh = () => Promise.resolve() } = this.props

    try {
      await refresh()
      this.refresher.element.complete()
    } catch (err) {
      if (__DEV__) {
        console.warn('an error occurred while refreshing data', err)
      }
      this.refresher.element.complete()
    }
  }
}

export default RefreshContent
