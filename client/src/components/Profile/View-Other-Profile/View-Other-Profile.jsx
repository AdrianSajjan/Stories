import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getProfileByID } from "../../../actions/profile";
import ViewProfile from "../View-Profile-Template/_ViewProfile";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";
import { Spinner } from "reactstrap";

const ViewOtherProfile = ({ currentProfile, profileByID, getProfileByID }) => {
  // View Other Profile
  const { id } = useParams();
  const { profile, loading } = profileByID;

  useEffect(() => {
    if (currentProfile.profile && currentProfile.profile.user._id !== id)
      getProfileByID(id);
    // eslint-disable-next-line
  }, [currentProfile.profile, id]);

  if (!currentProfile.profile) {
    if (currentProfile.loading)
      return <Spinner color="primary" className="d-block my-4 mx-auto" />;
    else
      return (
        <p className="text-center my-4 text-muted">
          Please create your profile first.
        </p>
      );
  }

  if (id === currentProfile.profile.user._id)
    return <Redirect to="/home/profile" />;

  if (!profile) {
    if (loading)
      return <Spinner color="primary" className="d-block my-4 mx-auto" />;
    else
      return <p className="text-center my-4 text-danger">Profile not found</p>;
  }

  return (
    <Fragment>
      <ViewProfile profile={profile} image={DefaultImage} owner={false} />
    </Fragment>
  );
};

ViewOtherProfile.propTypes = {
  currentProfile: PropTypes.object.isRequired,
  profileByID: PropTypes.object.isRequired,
  getProfileByID: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  profileByID: state.profile.profileByID,
});

const mapDispatchToProps = (dispatch) => ({
  getProfileByID: (id) => dispatch(getProfileByID(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewOtherProfile);
