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

import { resetAccountError, updateName } from "../../../actions/account";
import { connect } from "react-redux";

const UpdateName = ({ user, resetAccountError, errors, updateName }) => {
  const [name, setName] = useState("");

  useEffect(() => {
    errors.length > 0 && resetAccountError();
    return () => {
      errors.length > 0 && resetAccountError();
    }; //eslint-disable-next-line
  }, []);

  const HandleChange = (e) => {
    if (errors.length > 0) resetAccountError();
    setName(e.target.value);
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    if (errors.length > 0) resetAccountError();
    updateName(name.trim());
  };

  const NameHasError = () => {
    if (!errors || errors.length === 0) return false;
    return errors.some((error) => error.param === "name");
  };

  const GetNameError = () => {
    const error = errors.find((error) => error.param === "name");
    return error ? error.msg : "";
  };

  return (
    <Fragment>
      <Form className="my-4 px-4 px-md-5" onSubmit={HandleSubmit}>
        <FormGroup>
          <Label>Current Name</Label>
          <Input type="text" value={user.name} readOnly />
        </FormGroup>
        <FormGroup>
          <Label>New Name</Label>
          <Input
            type="text"
            name="name"
            placeholder="Enter new name..."
            value={name}
            onChange={HandleChange}
            invalid={NameHasError()}
          />
          {NameHasError() ? (
            <FormFeedback invalid="true">{GetNameError()}</FormFeedback>
          ) : (
            <FormText>Enter your real name</FormText>
          )}
        </FormGroup>
        <Button color="primary" className="mt-3 btn-rounded">
          Change Name
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
  updateName: (name) => dispatch(updateName(name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdateName);
