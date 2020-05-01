import React, { useState } from "react";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";

const ChatList = ({ profile }) => {
  return (
    <button className="chat-list">
      <img className="chat-avatar" src={profile.avatar.url} alt="profile" />
      <p className="mb-1 ml-2 text-secondary font-weight-bold leading-1">
        @{profile.username}
      </p>
    </button>
  );
};

const FollowingList = ({ currentProfile }) => {
  const { profile, loading } = currentProfile;

  if (!profile)
    if (loading)
      return <Spinner color="primary" className="mx-auto d-block mt-3" />;
    else
      return (
        <p className="text-muted text-center mt-3">
          Please Create Your Profile
        </p>
      );

  return (
    <div className="side-area-container chat-list-container">
      <h3 className="text-center text-muted">Chat List</h3>
      {profile.following.map(({ profile }, index) => (
        <ChatList key={index} profile={profile} />
      ))}
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
});

export default connect(mapStateToProps)(FollowingList);
