
const createMockStore = require('redux-mock-store')
const thunk = require('redux-thunk').default
const mockStore = createMockStore([thunk])
const DEFAULT_STATE = require('state').DEFAULT_STATE

exports.default = mockStore(DEFAULT_STATE)
