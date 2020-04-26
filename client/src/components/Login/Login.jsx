import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { removeLoginError, resetFormErrors } from "../../actions/error";
import queryString from "query-string";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
  FormText,
  FormFeedback,
  Label,
  Button,
  Spinner,
} from "reactstrap";

const Login = ({
  auth,
  errors,
  removeLoginError,
  resetFormErrors,
  login,
  location,
}) => {
  // Login Form
  const {
    request: { loginRequest: request },
    isAuthenticated,
  } = auth;

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const ResetFormError = () => {
    if (errors && errors.length > 0) resetFormErrors();
  };

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (ParamHasError(e.target.name)) removeLoginError(e.target.name);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    ResetFormError();

    const parsedQuery = queryString.parse(location.search);
    const next = parsedQuery.next;

    !request && login({ email: email.trim(), password }, next);
  };

  const TogglePasswordVisible = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
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
      <h2 className="text-info w-75 mx-auto text-center">Welcome Back</h2>
      <p className="text-secondary lead w-75 mx-auto text-center mb-5">
        <i className="fa fa-sign-in mr-2"></i>Login to your account
      </p>
      <Form className="mx-auto w-75" onSubmit={HandleSubmit}>
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
            invalid={ParamHasError("email") ? true : false}
          />
          {!ParamHasError("email") ? (
            <FormText>Enter registered email</FormText>
          ) : (
            <FormFeedback invalid="true">{GetParamError("email")}</FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="password-input" className="mb-1">
            Password
          </Label>
          <InputGroup>
            <Input
              type={passwordVisible ? "text" : "password"}
              id="password-input"
              placeholder="Enter Your Password"
              name="password"
              value={password}
              onChange={HandleChange}
              invalid={ParamHasError("password") ? true : false}
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
          {!ParamHasError("password") ? (
            <FormText>Password associated with your account</FormText>
          ) : (
            <FormFeedback className="d-block">
              {GetParamError("password")}
            </FormFeedback>
          )}
        </FormGroup>
        {!isAuthenticated && request ? (
          <Button color="primary" type="submit" className="form-btn mt-2">
            <Spinner size="sm" color="light" />
          </Button>
        ) : (
          <Button color="primary" type="submit" className="form-btn mt-2">
            Sign in
          </Button>
        )}
        <p className="text-muted mx-auto w-100 mt-4">
          {"Don't have an acount? "}
          <Link
            to="/register"
            className="toggle-btn ml-1"
            onClick={ResetFormError}
          >
            Sign Up
          </Link>
        </p>
      </Form>
    </Fragment>
  );
};

Login.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.array.isRequired,
  login: PropTypes.func.isRequired,
  removeLoginError: PropTypes.func.isRequired,
  resetFormErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.error.loginErrors,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  login: (data, next) => dispatch(login(data, ownProps, next)),
  removeLoginError: (param) => dispatch(removeLoginError(param)),
  resetFormErrors: () => dispatch(resetFormErrors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
