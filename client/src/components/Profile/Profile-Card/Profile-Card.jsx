import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { dismissProfileCard, updateFollowing } from "../../../actions/profile";
import PropTypes from "prop-types";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";
import "./Profile-Card.css";

const ProfileCard = ({
  currentProfile,
  profile,
  dismissProfileCard,
  updateFollowing,
  isDismissable,
}) => {
  const DismissCard = () => {
    dismissProfileCard(profile._id);
  };

  const FollowBtn = () => {
    const isFollowing = currentProfile.profile.following.some(
      (follow) => follow.profile._id === profile._id
    );

    if (isFollowing)
      return (
        <Button
          outline
          color="info"
          className="py-1 mr-2"
          onClick={() => updateFollowing(profile.user)}
        >
          Unfollow
        </Button>
      );

    return (
      <Button
        outline
        color="primary"
        className="py-1 mr-2"
        onClick={() => updateFollowing(profile.user)}
      >
        Follow
      </Button>
    );
  };

  return (
    <Fragment>
      <div className="profile-card px-2">
        <div className="d-flex flex-column align-items-center justify-content-center profile-card-container">
          {isDismissable && (
            <button className="dismiss-profile-card" onClick={DismissCard}>
              <span className="close-icon">&times;</span>
            </button>
          )}
          <img src={DefaultImage} alt="profile" className="profile-card-img" />
          <p className="profile-card-username text-dark mt-2">
            @{profile.username}
          </p>
          <div className="profile-btn-group d-flex justify-content-center">
            <FollowBtn />
            <Link
              to={`/home/profile/view/${profile.user}`}
              className="btn btn-outline-success py-1 ml-2"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
      <hr />
    </Fragment>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
  isDismissable: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
});

const mapDispatchToProps = (dispatch) => ({
  dismissProfileCard: (id) => dispatch(dismissProfileCard(id)),
  updateFollowing: (id) => dispatch(updateFollowing(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileCard);
