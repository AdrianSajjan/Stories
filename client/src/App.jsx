import store from './store'
import React, { useEffect } from 'react'
import { ToastProvider } from 'react-toast-notifications'
import { Provider } from 'react-redux'
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom'
import { loadUser } from './actions/auth'
import setAuthToken from './utils/set-auth-token'
import PrivateRoute from './components/Private-Route/Private-Route'
import Landing from './pages/Landing/Landing'
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
        <ToastProvider>
          <Switch>
            <PrivateRoute path="/home" component={Home} />
            <Route path="/logout" component={Logout} />
            <Route exact path="/verify/:token" component={Verify} />
            <Route path="/" component={Landing} />
          </Switch>
        </ToastProvider>
      </Router>
    </Provider>
  )
}

export default App
