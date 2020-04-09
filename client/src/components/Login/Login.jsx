import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { login } from "../../actions/auth";
import { removeFormError, removeFormErrors } from "../../actions/error";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  Input,
  FormFeedback,
  Label,
  Button,
} from "reactstrap";

const Login = ({ errors, removeFormError, removeFormErrors, login }) => {
  // Login Form
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const ResetFormError = () => {
    if (errors && errors.length > 0) removeFormErrors();
  };

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (ParamHasError(e.target.name)) removeFormError(e.target.name);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    ResetFormError();
    login({ email, password });
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
          <FormFeedback invalid="true">{GetParamError("email")}</FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="name-input" className="mb-1">
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
              { /*prettier-ignore*/ }
              <button tabIndex="-1" className="toggle-password-btn" onClick={TogglePasswordVisible} >
                {
                  passwordVisible ? ( <i className="fa fa-eye"></i>) : (<i className="fa fa-eye-slash"></i>)
                }
              </button>
            </InputGroupAddon>
          </InputGroup>
          <FormFeedback className="d-block">
            {GetParamError("password")}
          </FormFeedback>
        </FormGroup>
        <Button color="primary" type="submit" className="form-btn mt-2">
          Sign in
        </Button>
        <p className="text-muted mx-auto w-100 mt-4">
          {"Don't have an acount? "}
          { /* prettier-ignore*/ }
          <Link to="/register" className="toggle-btn ml-1" onClick={ResetFormError} >
            Sign Up
          </Link>
        </p>
      </Form>
    </Fragment>
  );
};

Login.propTypes = {
  errors: PropTypes.array.isRequired,
  login: PropTypes.func.isRequired,
  removeFormError: PropTypes.func.isRequired,
  removeFormErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.error,
});

const mapDispatchToProps = (dispatch) => ({
  login: (data) => dispatch(login(data)),
  removeFormError: (param) => dispatch(removeFormError(param)),
  removeFormErrors: () => dispatch(removeFormErrors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
