import React, { useEffect } from "react";
import store from "./store";
import { Provider } from "react-redux";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import setAuthToken from "./utils/set-auth-token";
import { loadUser } from "./actions/auth";
import PrivateRoute from "./components/Private-Route/Private-Route";
import Landing from "./pages/Landing/Landing";
import Alert from "./components/Alert/Alert";
import Home from "./pages/Home/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // App
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Alert />
        <Switch>
          <PrivateRoute path="/home" component={Home} />
          <Route path="/" component={Landing} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
