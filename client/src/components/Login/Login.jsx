import React, { useState, Fragment } from "react";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
  FormFeedback,
  Label,
} from "reactstrap";

const Login = () => {
  // Login Form
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const TogglePasswordVisible = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Fragment>
      <h2 className="text-info w-75 mx-auto text-center">Welcome Back</h2>
      <p className="text-secondary lead w-75 mx-auto text-center mb-5">
        <i className="fa fa-sign-in mr-2"></i>Login to your account
      </p>
      <Form className="mx-auto w-75">
        <FormGroup>
          <Label htmlFor="name-input" className="mb-1">
            Email
          </Label>
          <Input
            type="text"
            id="name-input"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={HandleChange}
          />
          <FormFeedback></FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="name-input" className="mb-1">
            Password
          </Label>
          <InputGroup>
            <Input
              type="text"
              className="border-right-none"
              id="password-input"
              placeholder="Enter Your Password"
              name="password"
              value={password}
              onChange={HandleChange}
            />
            <InputGroupAddon addonType="append">
              <button
                tabIndex="-1"
                className="toggle-password-btn"
                onClick={TogglePasswordVisible}
              >
                {passwordVisible ? (
                  <i className="fa fa-eye"></i>
                ) : (
                  <i className="fa fa-eye-slash"></i>
                )}
              </button>
            </InputGroupAddon>
          </InputGroup>
          <FormFeedback></FormFeedback>
        </FormGroup>
        <Button color="primary" type="submit" className="form-btn mt-2">
          Sign in
        </Button>
      </Form>
    </Fragment>
  );
};

export default Login;
