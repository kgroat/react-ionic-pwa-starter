
const fetchUser = {
  username: 'testuser',
  firstName: 'Test',
  lastName: 'McUser',
  email: 'test@user.com',
  verified: false,
}

exports.default = (username) => () =>
Promise.resolve(Object.assign({}, fetchUser, {
  username: username || fetchUser.username,
}))
