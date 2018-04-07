
const user = {
  username: 'testuser',
  firstName: 'Test',
  lastName: 'McUser',
  email: 'test@user.com',
  verified: false,
}

exports.default = (update) => () =>
Promise.resolve(Object.assign({}, user, update))
