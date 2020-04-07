import React, { useState, Fragment } from "react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <h2 className="text-info w-75 mx-auto text-center">Welcome Back</h2>
      <p className="text-secondary lead w-75 mx-auto text-center mb-5">
        <i className="fa fa-sign-in mr-2"></i>Login to your account
      </p>
      <form className="mx-auto w-75">
        <div className="form-group">
          <label htmlFor="name-input" className="mb-1">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="name-input"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={HandleChange}
          />
          <div className="invalid-feedback"></div>
        </div>
        <div className="form-group">
          <label htmlFor="name-input" className="mb-1">
            Password
          </label>
          <input
            type="text"
            className="form-control"
            id="password-input"
            placeholder="Enter Your Password"
            name="password"
            value={password}
            onChange={HandleChange}
          />
          <div className="invalid-feedback"></div>
        </div>
        <button type="submit" className="form-btn btn btn-primary mt-2">
          Sign In
        </button>
      </form>
    </Fragment>
  );
};

export default Login;
