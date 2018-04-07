
import * as React from 'react'
import { create } from 'react-test-renderer'
import { MemoryRouter, Route } from 'react-router'

import * as reduxMockStore from 'redux-mock-store'
const createMockStore: typeof reduxMockStore.default = reduxMockStore as any
import thunk from 'redux-thunk'

import { User } from 'models/user'
import { AppState, DEFAULT_STATE } from 'state'

import ConnectedProfileEditView, { ProfileEditView } from './ProfileEditView'

const mockStore = createMockStore<AppState>([thunk])
jest.mock('containers/ContentView')

const user: User = {
  username: 'testuser',
  firstName: 'Test',
  lastName: 'McUser',
  email: 'test@user.com',
  verified: true,
}

describe(`<${ProfileEditView.name} />`, () => {
  describe('snapshots', () => {
    it('should render loading when the user is undefined', () => {
      const store = mockStore({
        ...DEFAULT_STATE,
        entities: { users: { me: undefined } },
      })

      const tree = create((
        <MemoryRouter>
          <Route render={props => <ConnectedProfileEditView store={store} {...props} />} />
        </MemoryRouter>
      ))

      expect(tree).toMatchSnapshot()
    })

    it('should render the details of the user', () => {
      const store = mockStore({
        ...DEFAULT_STATE,
        entities: { users: { me: user } },
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
