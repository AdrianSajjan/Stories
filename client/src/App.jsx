import React, { useEffect } from 'react'
import store from './store'
import setAuthToken from './utils/set-auth-token'
import { Provider } from 'react-redux'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import { loadUser } from './actions/auth'
import PrivateRoute from './components/Private-Route/Private-Route'
import Landing from './pages/Landing/Landing'
import Alert from './components/Alert/Alert'
import Toast from './components/Toast/Toast'
import Home from './pages/Home/Home'
import Logout from './pages/Logout/Logout'
import Verify from './pages/Verify/Verify'

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Alert />
        <Toast />
        <Switch>
          <PrivateRoute path="/home" component={Home} />
          <Route path="/logout" component={Logout} />
          <Route exact path="/verify/:token" component={Verify} />
          <Route path="/" component={Landing} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default App
