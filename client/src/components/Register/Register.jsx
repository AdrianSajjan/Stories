import React, { useState, Fragment } from "react";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
  Label,
  FormFeedback,
  FormText,
  Button,
} from "reactstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";

const Register = ({ errors }) => {
  // Register Component
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
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

  const TogglePasswordVisible = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const ToggleConfirmPasswordVisible = (e) => {
    e.preventDefault();
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
  };

  const ParamHasError = (param) => {
    if (!errors || errors.length === 0) return false;
    return errors.some((error) => error.param === param);
  };

  const GetParamError = (param) => {
    const error = errors.find((error) => error.param === param);
    return error ? error.msg : "";
  };

  return (
    <Fragment>
      <h2 className="text-info w-75 mx-auto text-center">Join Now</h2>
      <p className="text-secondary lead w-75 mx-auto mb-5 text-center">
        <i className="fa fa-unlock-alt mr-2"></i>Create your account
      </p>
      <Form className="mx-auto w-75" onSubmit={HandleSubmit}>
        <FormGroup>
          <Label htmlFor="name-input" className="mb-1">
            Full Name
          </Label>
          <Input
            type="text"
            id="name-input"
            placeholder="Enter Your Name"
            name="name"
            value={name}
            onChange={HandleChange}
            invalid={ParamHasError("name") ? true : false}
          />
          <FormText>Please enter your real name.</FormText>
          <FormFeedback>{GetParamError("name")}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="email-input" className="mb-1">
            Email
          </Label>
          <Input
            type="text"
            id="email-input"
            placeholder="Enter Your Email Address"
            name="email"
            value={email}
            onChange={HandleChange}
            invalid={ParamHasError("email") ? true : false}
          />
          <FormText>We will never share your email.</FormText>
          <FormFeedback invalid="true">{GetParamError("email")}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password-input" className="mb-1">
            Password
          </Label>
          <InputGroup>
            <Input
              type={passwordVisible ? "text" : "password"}
              id="password-input"
              className="border-right-none"
              placeholder="Enter A Password"
              name="password"
              value={password}
              onChange={HandleChange}
              invalid={ParamHasError("password") ? true : false}
            />
            <InputGroupAddon addonType="append">
              <button
                type="button"
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
          <FormText>Minimum 6 letters.</FormText>
          <FormFeedback invalid="true">
            {GetParamError("password")}
          </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirm-password-input" className="mb-1">
            Confirm Password
          </Label>
          <InputGroup>
            <Input
              type={confirmPasswordVisible ? "text" : "password"}
              id="confirm-password-input"
              className="border-right-none"
              placeholder="Confirm Your Password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={HandleChange}
              invalid={ParamHasError("confirmPassword") ? true : false}
            />
            <InputGroupAddon addonType="prepend">
              <button
                tabIndex="-1"
                className="toggle-password-btn"
                onClick={ToggleConfirmPasswordVisible}
              >
                {confirmPasswordVisible ? (
                  <i className="fa fa-eye"></i>
                ) : (
                  <i className="fa fa-eye-slash"></i>
                )}
              </button>
            </InputGroupAddon>
          </InputGroup>
          <FormText>Retype the password</FormText>
          <FormFeedback invalid="true">
            {GetParamError("confirmPassword")}
          </FormFeedback>
        </FormGroup>
        <Button color="primary" type="submit" className="form-btn mt-2">
          Sign up
        </Button>
      </Form>
    </Fragment>
  );
};

Register.propTypes = {
  errors: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.error,
});

export default connect(mapStateToProps)(Register);
