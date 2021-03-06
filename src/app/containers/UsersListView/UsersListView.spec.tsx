
import * as React from 'react'
import { create } from 'react-test-renderer'
import { MemoryRouter, Route } from 'react-router'

import * as reduxMockStore from 'redux-mock-store'
const createMockStore: typeof reduxMockStore.default = reduxMockStore as any
import thunk from 'redux-thunk'
import ConnectedUsersListView, { UsersListView } from './UsersListView'

import { AppState, DEFAULT_STATE } from 'state'

const mockStore = createMockStore<AppState>([thunk])

jest.mock('containers/ContentView/ContentView')
jest.mock('thunks/fetchUsersList')
jest.mock('redux-store/store')

describe(`<${UsersListView.name} />`, () => {
  describe('snapshots', () => {
    it('should render correctly', () => {
      const store = mockStore(DEFAULT_STATE)
      const tree = create((
        <MemoryRouter>
          <Route render={props => <ConnectedUsersListView store={store} {...props} />} />
        </MemoryRouter>
      ))

      expect(tree).toMatchSnapshot()
    })
  })
})
