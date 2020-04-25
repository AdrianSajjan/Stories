import React, { Fragment, useState } from "react";
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
import { connect } from "react-redux";

const UpdateName = ({ user }) => {
  const [name, setName] = useState("");

  return (
    <Fragment>
      <Form className="my-4 px-4 px-md-5">
        <FormGroup>
          <Label>Current Name</Label>
          <Input type="text" value={user.name} readOnly />
        </FormGroup>
        <FormGroup>
          <Label>New Name</Label>
          <Input
            type="text"
            placeholder="Enter new name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <FormText>Enter your real name</FormText>
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
});

export default connect(mapStateToProps)(UpdateName);
