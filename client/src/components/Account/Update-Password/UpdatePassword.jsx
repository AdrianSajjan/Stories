import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  FormFeedback,
} from "reactstrap";

import {
  removePasswordError,
  resetAccountError,
  updatePassword,
} from "../../../actions/account";
import { connect } from "react-redux";

const UpdatePassword = ({
  removePasswordError,
  resetAccountError,
  errors,
  updatePassword,
}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    errors.length > 0 && resetAccountError();
    return () => {
      errors.length > 0 && resetAccountError();
    }; //eslint-disable-next-line
  }, []);

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const { oldPassword, newPassword, confirmNewPassword } = password;

  const HandleChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
    if (ParamHasError(e.target.name)) removePasswordError(e.target.name);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    if (errors.length > 0) resetAccountError();
    updatePassword(password);
    setPassword({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
  };

  const TogglePasswordVisible = (e) => {
    e.preventDefault();
    setPasswordVisible((prevState) => !prevState);
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
      <Form className="my-4 px-4 px-md-5" onSubmit={HandleSubmit}>
        <FormGroup>
          <Label for="old-password-input">Current Password</Label>
          <InputGroup>
            <Input
              type={passwordVisible ? "text" : "password"}
              id="old-password-input"
              placeholder="Enter Your Password"
              name="oldPassword"
              value={oldPassword}
              onChange={HandleChange}
              invalid={ParamHasError("oldPassword")}
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
          <FormFeedback className="d-block" invalid="true">
            {GetParamError("oldPassword")}
          </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="new-password-input">New Password</Label>
          <Input
            type={passwordVisible ? "text" : "password"}
            id="new-password-input"
            placeholder="Enter New Password"
            name="newPassword"
            value={newPassword}
            onChange={HandleChange}
            invalid={ParamHasError("newPassword")}
          />
          <FormFeedback invalid="true">
            {GetParamError("newPassword")}
          </FormFeedback>
        </FormGroup>
        <FormGroup>
          <Label for="confirm-new-password-input">Confirm Password</Label>
          <Input
            type={passwordVisible ? "text" : "password"}
            id="confirm-new-password-input"
            placeholder="Confirm New Password"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={HandleChange}
            invalid={ParamHasError("confirmNewPassword")}
          />
          <FormFeedback invalid="true">
            {GetParamError("confirmNewPassword")}
          </FormFeedback>
        </FormGroup>
        <Button color="primary" className="mt-3 btn-rounded">
          Update Password
        </Button>
        <Link
          to="/home/account/"
          className="mt-3 ml-3 btn btn-rounded btn-secondary"
        >
          Go Back
        </Link>
      </Form>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  errors: state.error.accountErrors,
});

const mapDispatchToProps = (dispatch) => ({
  resetAccountError: () => dispatch(resetAccountError()),
  removePasswordError: (param) => dispatch(removePasswordError(param)),
  updatePassword: (password) => dispatch(updatePassword(password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);
