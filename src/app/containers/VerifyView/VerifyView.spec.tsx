
import * as React from 'react'
import { create } from 'react-test-renderer'
import { MemoryRouter, Route } from 'react-router'

import * as reduxMockStore from 'redux-mock-store'
const createMockStore: typeof reduxMockStore.default = reduxMockStore as any
import thunk from 'redux-thunk'

import { AppState, DEFAULT_STATE } from 'state'

import ConnectedVerifyView, { VerifyView } from './VerifyView'

const mockStore = createMockStore<AppState>([thunk])
jest.mock('containers/ContentView')
jest.mock('thunks/fetchUser')
jest.mock('redux-store/store')
jest.mock('redux-store/api', () => ({
  GET: () => Promise.resolve({ success: true }),
  HttpError: class extends Error {},
}))

describe(`<${VerifyView.name} />`, () => {
  describe('snapshots', () => {
    it('should render correctly', () => {
      const store = mockStore(DEFAULT_STATE)
      const tree = create((
        <MemoryRouter>
          <Route render={props => <ConnectedVerifyView store={store} {...props} />} />
        </MemoryRouter>
      ))

      expect(tree).toMatchSnapshot()
    })
  })
})
