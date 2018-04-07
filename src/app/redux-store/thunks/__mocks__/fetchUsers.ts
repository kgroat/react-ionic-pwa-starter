
const user = {
  username: 'testuser',
  firstName: 'Test',
  lastName: 'McUser',
  email: 'test@user.com',
  verified: false,
}

exports.default = (username) => () =>
Promise.resolve(Object.assign({}, user, {
  username: username || user.username,
}))
