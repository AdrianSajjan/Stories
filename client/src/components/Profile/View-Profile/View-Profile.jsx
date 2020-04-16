import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { Redirect, useParams } from "react-router-dom";
import { connect } from "react-redux";
import { Spinner } from "reactstrap";
import Posts from "../../Posts/Posts";
import { getProfileByID } from "../../../actions/profile";
import { getPostsByUser } from "../../../actions/post";
import "./View-Profile.css";

const ViewProfile = ({
  owner,
  currentProfile,
  currentPosts,
  getProfileByID,
  getPostsByUser,
  postsByUser,
  profileByID,
}) => {
  // View Profile
  const { ID: userID } = useParams();

  useEffect(() => {
    if (
      currentProfile.profile &&
      !owner &&
      currentProfile.profile.user._id !== userID
    ) {
      getProfileByID(userID);
      getPostsByUser(userID);
    } //eslint-disable-next-line
  }, [userID, currentProfile.profile, owner]);

  if (currentProfile.profile === null) {
    if (currentProfile.loading) {
      return <Spinner color="primary" className="d-block mx-auto my-4" />;
    } else {
      if (owner) return <Redirect to="/home/profile/edit" />;
      else
        return (
          <p className="my-4 text-center text-muted">
            Please create your profile in order to browse other users.
          </p>
        );
    }
  }
  if (currentProfile.profile.user._id === userID)
    return <Redirect to="/home/profile" />;

  return (
    <Fragment>
      {/*@todo: Add View Profile */}
      <div className="w-100 pt-2 pb-1 profile-posts">
        <h3 className="text-center text-secondary">Posts</h3>
      </div>
      {currentPosts.posts.length === 0 ? (
        currentPosts.loading ? (
          <Spinner color="primary" className="my-5 d-block mx-auto" />
        ) : (
          <p className="mt-4 text-muted text-center">No Posts Found.</p>
        )
      ) : (
        <div>
          <Posts posts={currentPosts.posts} />
          <p className="text-center text-muted my-2">End of Posts.</p>
        </div>
      )}
    </Fragment>
  );
};

ViewProfile.propTypes = {
  owner: PropTypes.bool.isRequired,
  currentProfile: PropTypes.object.isRequired,
  currentPosts: PropTypes.array.isRequired,
  getProfileByID: PropTypes.func.isRequired,
  getPostsByUser: PropTypes.func.isRequired,
  profileByID: PropTypes.object.isRequired,
  postsByUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  currentPosts: state.post.userPosts,
  profileByID: state.profile.profileByID,
  postsByUser: state.post.postsByUser,
});

const mapDispatchToProps = (dispatch) => ({
  getProfileByID: (userID) => dispatch(getProfileByID(userID)),
  getPostsByUser: (userID) => dispatch(getPostsByUser(userID)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewProfile);
