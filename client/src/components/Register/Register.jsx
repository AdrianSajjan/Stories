import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { register } from "../../actions/auth";
import { removeFormErrors, removeFormError } from "../../actions/error";
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

const Register = ({ errors, register, removeFormErrors, removeFormError }) => {
  // Register Component
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { name, email, password, confirmPassword } = formData;

  const ResetFormError = () => {
    if (errors && errors.length > 0) removeFormErrors();
  };

  const HandleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (ParamHasError(e.target.name)) removeFormError(e.target.name);
  };

  const TogglePasswordVisible = (e) => {
    e.preventDefault();
    setPasswordVisible(!passwordVisible);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    ResetFormError();
    register({ name, email, password, confirmPassword });
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
          {!ParamHasError("name") ? (
            <FormText>Please enter your real name.</FormText>
          ) : (
            <FormFeedback invalid="true">{GetParamError("name")}</FormFeedback>
          )}
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
          {!ParamHasError("email") ? (
            <FormText>We will never share your email.</FormText>
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
              placeholder="Enter A Password"
              name="password"
              value={password}
              onChange={HandleChange}
              invalid={ParamHasError("password") ? true : false}
            />
            <InputGroupAddon addonType="append">
              { /*prettier-ignore*/ }
              <button type="button" tabIndex="-1" className="toggle-password-btn" onClick={TogglePasswordVisible}>
                {
                  passwordVisible ? ( <i className="fa fa-eye"></i> ) : ( <i className="fa fa-eye-slash"></i> )
                }
              </button>
            </InputGroupAddon>
          </InputGroup>
          {!ParamHasError("password") ? (
            <FormText>Password should be minimum 6 letters.</FormText>
          ) : (
            <FormFeedback invalid="true" className="d-block">
              {GetParamError("password")}
            </FormFeedback>
          )}
        </FormGroup>
        <FormGroup>
          <Label htmlFor="confirm-password-input" className="mb-1">
            Confirm Password
          </Label>
          <Input
            type={passwordVisible ? "text" : "password"}
            id="confirm-password-input"
            placeholder="Confirm Your Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={HandleChange}
            invalid={ParamHasError("confirmPassword") ? true : false}
          />
          {!ParamHasError("confirmPassword") ? (
            <FormText>Retype your password.</FormText>
          ) : (
            <FormFeedback invalid="true">
              {GetParamError("confirmPassword")}
            </FormFeedback>
          )}
        </FormGroup>
        <Button color="primary" type="submit" className="form-btn mt-2">
          Sign up
        </Button>
        <p className="text-muted mx-auto w-100 mt-4">
          {"Already have an acount? "}
          { /* prettier-ignore*/ }
          <Link to="/login" className="toggle-btn ml-1" onClick={ResetFormError} >
            Sign In
          </Link>
        </p>
      </Form>
    </Fragment>
  );
};

Register.propTypes = {
  errors: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  removeFormError: PropTypes.func.isRequired,
  removeFormErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.error,
});

const mapDispatchToProps = (dispatch) => ({
  register: (data) => dispatch(register(data)),
  removeFormError: (param) => dispatch(removeFormError(param)),
  removeFormErrors: () => dispatch(removeFormErrors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
