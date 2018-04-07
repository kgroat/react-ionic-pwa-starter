
import * as React from 'react'
import { create } from 'react-test-renderer'
import { shallow } from 'enzyme'
import { MemoryRouter, Route } from 'react-router'

import * as reduxMockStore from 'redux-mock-store'
const createMockStore: typeof reduxMockStore.default = reduxMockStore as any
import thunk from 'redux-thunk'
const mockStore = createMockStore([thunk])

import { User } from 'models/user'

import ConnectedProfileEditView, { ProfileEditView } from './ProfileEditView'

jest.mock('containers/ContentView')

describe(`<${ProfileEditView.name} />`, () => {
  it('should render the details of the user', () => {
    const user = {

    }
    const store = mockStore({
      entities: { users: { me: undefined } },
    })

    const tree = create((
      <MemoryRouter>
        <Route render={props => <ConnectedProfileEditView store={store} {...props} />} />
      </MemoryRouter>
    ))

    expect(tree).toMatchSnapshot()
  })

  describe('snapshots', () => {
    it('should render loading when the user is undefined', () => {
      const store = mockStore({
        entities: { users: { me: undefined } },
      })

      const tree = create((
        <MemoryRouter>
          <Route render={props => <ConnectedProfileEditView store={store} {...props} />} />
        </MemoryRouter>
      ))

      expect(tree).toMatchSnapshot()
    })
  })
})
