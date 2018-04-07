
import * as React from 'react'
import { create } from 'react-test-renderer'
import { MemoryRouter, Route } from 'react-router'

import * as reduxMockStore from 'redux-mock-store'
const createMockStore: typeof reduxMockStore.default = reduxMockStore as any
import thunk from 'redux-thunk'
const mockStore = createMockStore([thunk])

import ConnectedVerifyView, { VerifyView } from './VerifyView'

jest.mock('containers/ContentView')

describe(`<${VerifyView.name} />`, () => {
  describe('snapshots', () => {
    const store = mockStore({})
    it('should render correctly', () => {
      const tree = create((
        <MemoryRouter>
          <Route render={props => <ConnectedVerifyView store={store} {...props} />} />
        </MemoryRouter>
      ))

      expect(tree).toMatchSnapshot()
    })
  })
})
