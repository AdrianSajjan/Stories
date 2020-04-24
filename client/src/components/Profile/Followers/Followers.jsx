import React, { Fragment } from "react";
import PropTypes from "prop-types";
import ProfileCard from "../Profile-Card/Profile-Card";

const Followers = ({ owner, profile }) => {
  const FollowerList = () => {
    if (profile.followers.length === 0)
      return (
        <Fragment>
          <p className="text-center my-3">No one is following you as of now.</p>
          <hr />
        </Fragment>
      );

    return profile.followers.map((follow) => (
      <ProfileCard
        key={follow._id}
        profile={follow.profile}
        isDismissable={false}
      />
    ));
  };

  return (
    <div className="profile-followers my-3">
      <div className="profile-followers-container">
        <hr />
        <FollowerList />
      </div>
    </div>
  );
};

Followers.propTypes = {
  owner: PropTypes.bool.isRequired,
  profile: PropTypes.object.isRequired,
};

export default Followers;
