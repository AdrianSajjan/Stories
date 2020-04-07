import React, { useState, Fragment } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fragment>
      <h2 className="text-info w-75 mx-auto text-center">Join Now</h2>
      <p className="text-secondary lead w-75 mx-auto mb-5 text-center">
        <i className="fa fa-unlock-alt mr-2"></i>Create your account
      </p>
      <form className="mx-auto w-75">
        <div className="form-group">
          <label htmlFor="name-input" className="mb-1">
            Full Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name-input"
            placeholder="Enter Your Name"
            name="name"
            value={name}
            onChange={HandleChange}
          />
          <div className="invalid-feedback"></div>
        </div>
        <div className="form-group">
          <label htmlFor="name-input" className="mb-1">
            Email
          </label>
          <input
            type="text"
            className="form-control"
            id="name-input"
            placeholder="Enter Your Email Address"
            name="email"
            value={email}
            onChange={HandleChange}
          />
          <small className="form-text text-muted">
            We will never share your email.
          </small>
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
            placeholder="Enter A Password"
            name="password"
            value={password}
            onChange={HandleChange}
          />
          <small className="form-text text-muted">Minimum 6 letters.</small>
          <div className="invalid-feedback"></div>
        </div>
        <div className="form-group">
          <label htmlFor="name-input" className="mb-1">
            Confirm Password
          </label>
          <input
            type="text"
            className="form-control"
            id="password-input"
            placeholder="Confirm Your Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={HandleChange}
          />
          <div className="invalid-feedback"></div>
        </div>
        <button type="submit" className="form-btn btn btn-primary mt-2">
          Sign up
        </button>
      </form>
    </Fragment>
  );
};

export default Register;
