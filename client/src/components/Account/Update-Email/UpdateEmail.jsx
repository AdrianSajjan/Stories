import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Button,
  Input,
  FormText,
  FormFeedback,
} from "reactstrap";

import { resetAccountError, updateEmail } from "../../../actions/account";
import { connect } from "react-redux";

const UpdateEmail = ({ user, resetAccountError, errors, updateEmail }) => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    errors.length > 0 && resetAccountError();
    return () => {
      errors.length > 0 && resetAccountError();
    }; // eslint-disable-next-line
  }, []);

  const HandleChange = (e) => {
    if (errors.length > 0) resetAccountError();
    setEmail(e.target.value);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    if (errors.length > 0) resetAccountError();
    updateEmail(email.trim());
  };

  const EmailHasError = () => {
    if (!errors || errors.length === 0) return false;
    return errors.some((error) => error.param === "email");
  };

  const GetEmailError = () => {
    const error = errors.find((error) => error.param === "email");
    return error ? error.msg : "";
  };

  return (
    <Fragment>
      <Form className="my-4 px-4 px-md-5" onSubmit={HandleSubmit}>
        <FormGroup>
          <Label>Current Email</Label>
          <Input type="text" value={user.email} readOnly />
        </FormGroup>
        <FormGroup>
          <Label>New Email</Label>
          <Input
            type="text"
            placeholder="Enter new email..."
            value={email}
            onChange={HandleChange}
            invalid={EmailHasError()}
          />
          {EmailHasError() ? (
            <FormFeedback invalid="true">{GetEmailError()}</FormFeedback>
          ) : (
            <FormText>Enter a valid email</FormText>
          )}
        </FormGroup>
        <Button color="primary" className="mt-3 btn-rounded">
          Update Email
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
  updateEmail: (email) => dispatch(updateEmail(email)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateEmail);
