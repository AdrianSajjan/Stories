import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import {
  Form,
  Input,
  Button,
  FormGroup,
  Label,
  FormFeedback,
  FormText,
  Spinner,
} from "reactstrap";
import { connect } from "react-redux";
import { setProfile } from "../../../actions/profile";
import ProfileImage from "./Profile-Image";
import "react-datepicker/dist/react-datepicker.css";
import "./Profile-Details.css";

const ProfileInfo = ({ currentProfile, setProfile, errors }) => {
  // Profile Info
  const { profile, loading: profileLoading } = currentProfile;

  const [formData, setFormData] = useState({
    username: "",
    dob: new Date(),
    bio: "",
    country: "",
    state: "",
    locality: "",
  });

  const { username, dob, bio, country, state, locality } = formData;

  const InitFields = () => {
    setFormData({
      username: profile.username,
      dob: new Date(profile.dob),
      country: profile.country,
      bio: profile.bio || "",
      state: profile.state || "",
      locality: profile.locality || "",
    });
  };

  useEffect(() => {
    if (profile !== null) InitFields();
    // eslint-disable-next-line
  }, [profile]);

  const HandleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const HandleDate = (value) => {
    setFormData({
      ...formData,
      dob: value,
    });
  };

  const HandleSubmit = (event) => {
    event.preventDefault();
    setProfile(formData);
  };

  const ParamHasError = (param) => {
    return errors.some((error) => error.param && error.param === param);
  };

  const GetParamError = (param) => {
    const error = errors.find((error) => error.param && error.param === param);
    return error ? error.msg : "";
  };

  return (
    <Fragment>
      {profile === null && profileLoading ? (
        <Spinner className="d-block mx-auto my-5" />
      ) : (
        <Fragment>
          <ProfileImage />
          <Form className="my-5 px-4 px-md-5" onSubmit={HandleSubmit}>
            <FormGroup>
              <Label htmlFor="username-input">Username</Label>
              <Input
                id="username-input"
                name="username"
                invalid={ParamHasError("username") ? true : false}
                placeholder="Give yourself an username"
                value={username}
                onChange={HandleChange}
              />
              {!ParamHasError("username") ? (
                <FormText>Field is required</FormText>
              ) : (
                <FormFeedback invalid="true">
                  {GetParamError("username")}
                </FormFeedback>
              )}
            </FormGroup>
            <FormGroup className="d-flex flex-column">
              <Label htmlFor="dob-input">Date of birth</Label>
              <DatePicker
                name="dob"
                id="dob-input"
                className="form-control"
                selected={dob}
                onChange={HandleDate}
              />
              <Input
                invalid={ParamHasError("dob") ? true : false}
                className="d-none"
              />
              {!ParamHasError("dob") ? (
                <FormText>Field is required</FormText>
              ) : (
                <FormFeedback invalid="true">
                  {GetParamError("dob")}
                </FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="country-input">Country</Label>
              <Input
                id="country-input"
                name="country"
                invalid={ParamHasError("country") ? true : false}
                placeholder="Which country are you presently living?"
                value={country}
                onChange={HandleChange}
              />
              {!ParamHasError("country") ? (
                <FormText>Field is required</FormText>
              ) : (
                <FormFeedback invalid="true">
                  {GetParamError("country")}
                </FormFeedback>
              )}
            </FormGroup>
            <FormGroup>
              <Label htmlFor="state-input">State</Label>
              <Input
                id="state-input"
                name="state"
                invalid={false}
                placeholder="The state you are present at?"
                value={state}
                onChange={HandleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="locality-input">Locality</Label>
              <Input
                id="locality-input"
                name="locality"
                invalid={false}
                placeholder="The locality you are present at?"
                value={locality}
                onChange={HandleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="bio-input">Bio</Label>
              <Input
                type="textarea"
                id="bio-input"
                name="bio"
                maxLength="250"
                rows="5"
                placeholder="Enter a short bio for yourself"
                value={bio}
                onChange={HandleChange}
              />
              <FormText>{250 - bio.length}/250</FormText>
            </FormGroup>
            <Button type="submit" className="mt-2" color="primary">
              {profile !== null ? "Update Profile" : "Create Profile"}
            </Button>
            <Button
              type="button"
              className="mt-2 ml-2"
              color="secondary"
              onClick={InitFields}
            >
              Cancel
            </Button>
          </Form>
        </Fragment>
      )}
    </Fragment>
  );
};

ProfileInfo.propTypes = {
  currentProfile: PropTypes.object.isRequired,
  setProfile: PropTypes.func.isRequired,
  errors: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  errors: state.profile.errors,
});

const mapDispatchToProps = (dispatch) => ({
  setProfile: (data) => dispatch(setProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);
