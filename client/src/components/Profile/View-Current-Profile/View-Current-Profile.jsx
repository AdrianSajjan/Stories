import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";
import { connect } from "react-redux";
import ViewProfile from "../View-Profile-Template/_ViewProfile";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";

const ViewCurrentProfile = ({ currentProfile }) => {
  // Current Profile
  const { profile, loading } = currentProfile;

  if (!profile && loading)
    return <Spinner color="primary" className="d-block my-5 mx-auto" />;

  if (!profile && !loading) return <Redirect to="/home/profile/edit/" />;

  return (
    <Fragment>
      <ViewProfile profile={profile} image={DefaultImage} owner={true} />
    </Fragment>
  );
};

ViewCurrentProfile.propTypes = {
  currentProfile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
});

export default connect(mapStateToProps)(ViewCurrentProfile);
