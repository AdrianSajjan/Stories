import React, { Fragment } from "react";
import PropTypes from "prop-types";
import ProfileCard from "../Profile-Card/Profile-Card";

const Followers = ({ owner, profile }) => {
  const FollowerList = () => {
    if (profile.followers.length === 0)
      return (
        <Fragment>
          <p className="text-center my-3">
            {owner
              ? "No one is following you as of now."
              : `${profile.username} has no followers as of now.`}
          </p>
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
        <p className="text-center text-dark m-0">
          Followers{"  "}
          <span className="text-muted font-weight-bold">
            {profile.followers.length}
          </span>
        </p>
        <hr className="mt-2" />
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
