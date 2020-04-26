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
  FormText,
  FormFeedback,
} from "reactstrap";

import {
  removePasswordError,
  resetAccountError,
} from "../../../actions/account";
import { connect } from "react-redux";

const UpdatePassword = ({ removePasswordError, resetAccountError, errors }) => {
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
  };

  const TogglePasswordVisible = (e) => {
    e.preventDefault();
    setPasswordVisible((prevState) => !prevState);
  };

  return (
    <Fragment>
      <Form className="my-4 px-4 px-md-5">
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
          />
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
          />
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
  removePasswordError: () => dispatch(removePasswordError()),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePassword);
