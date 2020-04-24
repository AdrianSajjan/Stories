import React, { Fragment } from "react";
import PropTypes from "prop-types";
import ProfileCard from "../Profile-Card/Profile-Card";

const Following = ({ owner, profile }) => {
  const FollowerList = () => {
    if (profile.following.length === 0)
      return (
        <Fragment>
          <p className="text-center my-3">You are not following anyone</p>
          <hr />
        </Fragment>
      );

    return profile.following.map((follow) => (
      <ProfileCard
        key={follow._id}
        profile={follow.profile}
        isDismissable={false}
      />
    ));
  };

  return (
    <div className="profile-following my-3">
      <div className="profile-following-container">
        <hr />
        <FollowerList />
      </div>
    </div>
  );
};

Following.propTypes = {
  owner: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired,
};

export default Following;
