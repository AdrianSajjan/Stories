import React, { Fragment } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./pages/Landing/Landing";
import Alert from "./components/Alert/Alert";
import "./App.css";

const App = () => {
  return (
    <Fragment>
      <Alert />
      <Landing />
    </Fragment>
  );
};

export default App;
