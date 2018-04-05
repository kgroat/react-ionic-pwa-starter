
import * as React from 'react'
import { create } from 'react-test-renderer'
import { shallow } from 'enzyme'
import { MemoryRouter, Route } from 'react-router'

import * as reduxMockStore from 'redux-mock-store'
const createMockStore: typeof reduxMockStore.default = reduxMockStore as any
import thunk from 'redux-thunk'
const mockStore = createMockStore([thunk])

import ConnectedCOMPONENT_NAMEView, { COMPONENT_NAMEView } from './COMPONENT_NAMEView'

jest.mock('containers/ContentView')

describe(`<${COMPONENT_NAMEView.name} />`, () => {
  describe('snapshots', () => {
    const store = mockStore({})
    it('should render correctly', () => {
      const tree = create((
        <MemoryRouter>
          <Route render={props => <ConnectedCOMPONENT_NAMEView store={store} {...props} />} />
        </MemoryRouter>
      ))

      expect(tree).toMatchSnapshot()
    })
  })
})
