
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory({
  basename: process.env.BASE_URL,
})

export default history
