import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";

const ViewProfile = ({ owner, currentProfile }) => {
  // View Profile
  const { loading, profile } = currentProfile;

  if (loading && profile === null)
    return <Spinner color="primary" className="d-block mx-auto my-4" />;

  return <div>{owner ? "My Profile" : "Other"}</div>;
};

ViewProfile.propTypes = {
  owner: PropTypes.bool.isRequired,
  currentProfile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
});

export default connect(mapStateToProps)(ViewProfile);
