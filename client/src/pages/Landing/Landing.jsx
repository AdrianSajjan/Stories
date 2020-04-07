import React, { useState } from "react";
import "./Landing.css";
import Register from "../../components/Register/Register";
import Login from "../../components/Login/Login";

const Landing = () => {
  // 0 for Sign Up and 1 for Login
  const [activeForm, toggleActiveForm] = useState(1);

  const ToggleForm = () => {
    activeForm === 0 ? toggleActiveForm(1) : toggleActiveForm(0);
  };

  return (
    <div className="landing-page">
      <div className="container-fluid h-100">
        <div className="row h-100">
          <div className="col-5 p-5 d-flex flex-column justify-content-center align-items-center bg-charcoal">
            <h1 className="brand-name text-light text-center">stories!</h1>
            <p className="lead text-jellybean text-center">
              Because words are special
            </p>
          </div>
          <div className="col-7 px-5 pt-5 pb-1 d-flex flex-column justify-content-center bg-light">
            {activeForm === 0 ? <Register /> : <Login />}
            <p className="text-muted mx-auto w-75 mt-4">
              {activeForm === 0
                ? "Already have an account?"
                : "Don't have an account?"}
              <button className="toggle-btn ml-1" onClick={ToggleForm}>
                {activeForm === 0 ? "Sign In" : "Sign Up"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
