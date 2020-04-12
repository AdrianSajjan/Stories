import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  FormGroup,
  Label,
  FormFeedback,
  FormText,
  Spinner,
} from "reactstrap";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import { setProfile } from "../../actions/profile";
import DefaultImage from "../../assets/images/sample-profile-picture.png";
import "react-datepicker/dist/react-datepicker.css";
import "./Profile.css";

const Profile = ({ _profile, setProfile }) => {
  // Profile
  const { loading, profile } = _profile;
  // eslint-disable-next-line
  const [image, setImage] = useState(null);
  const [exists, setExists] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    dob: new Date(),
    bio: "",
    country: "",
    state: "",
    locality: "",
  });

  const { username, dob, bio, country, state, locality } = formData;

  useEffect(
    () => {
      if (profile !== null) {
        setExists(true);
        InitFields();
      }
    }, // eslint-disable-next-line
    [profile]
  );

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

  return (
    <Fragment>
      <Row>
        <Col className="main-area p-0" sm="8" md="12" lg="8">
          <div className="main-area-header">
            <button className="sidebar-toggler-btn">
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <h1 className="main-title text-secondary">Profile</h1>
          </div>
          {loading && profile === null ? (
            <Spinner className="mx-auto d-block mt-5" color="primary" />
          ) : (
            <div className="main-profile-info mt-5">
              <form className="image-upload-form">
                <img
                  src={image ? image : DefaultImage}
                  alt="profile"
                  className="profile-image"
                />
                <input
                  type="file"
                  name="upload-profile-image"
                  id="image-upload-input"
                  accept="image/*"
                />
                <label
                  className="btn btn-primary ml-2 image-upload-label"
                  htmlFor="image-upload-input"
                >
                  Select
                </label>
                <button type="submit" className="btn btn-primary mb-2 ml-2">
                  Upload
                </button>
              </form>
              <Form className="my-5 px-4 px-md-5" onSubmit={HandleSubmit}>
                <FormGroup>
                  <Label htmlFor="username-input">Username</Label>
                  <Input
                    id="username-input"
                    name="username"
                    invalid={false}
                    placeholder="Give yourself an username"
                    value={username}
                    onChange={HandleChange}
                  />
                  <FormText>Field is required</FormText>
                  <FormFeedback invalid="true"></FormFeedback>
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
                  <FormText>Field is required</FormText>
                  <FormFeedback invalid="true"></FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="country-input">Country</Label>
                  <Input
                    id="country-input"
                    name="country"
                    invalid={false}
                    placeholder="Which country are you presently living?"
                    value={country}
                    onChange={HandleChange}
                  />
                  <FormText>Field is required</FormText>
                  <FormFeedback invalid="true"></FormFeedback>
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
                  {exists ? "Update Profile" : "Create Profile"}
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
            </div>
          )}
        </Col>
        <Col className="side-area bg-primary d-sm-block d-md-none d-lg-block"></Col>
      </Row>
    </Fragment>
  );
};

Profile.propTypes = {
  _profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  _profile: state.profile,
});

const mapDispatchToProps = (dispatch) => ({
  setProfile: (data) => dispatch(setProfile(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
