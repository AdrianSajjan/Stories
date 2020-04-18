import React, { Fragment } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { Spinner } from "reactstrap";
import { connect } from "react-redux";
import ViewProfile from "../View-Profile-Template/_ViewProfile";
import Posts from "../../Posts/Posts";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";

const ViewCurrentProfile = ({ currentProfile, userPosts }) => {
  // Current Profile
  const { profile, loading: profileLoading } = currentProfile;
  const { posts, loading: postsLoading } = userPosts;

  if (!profile)
    if (profileLoading)
      return <Spinner color="primary" className="d-block my-5 mx-auto" />;
    else return <Redirect to="/home/profile/edit/" />;

  const ViewPosts = () => {
    if (!posts.length && postsLoading)
      return <Spinner color="primary" className="d-block my-2 mx-auto" />;
    if (!posts.length && !postsLoading)
      return <p className="text-center text-muted my-2">No Posts Found</p>;

    return (
      <Fragment>
        <Posts posts={posts} />
        <p className="text-center text-muted my-3">End of Posts</p>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <ViewProfile profile={profile} image={DefaultImage} owner={true} />
      <div className="view-posts mt-5">
        <h2 className="text-center py-2 text-secondary posts-heading">Posts</h2>
        <ViewPosts />
      </div>
    </Fragment>
  );
};

ViewCurrentProfile.propTypes = {
  currentProfile: PropTypes.object.isRequired,
  userPosts: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  userPosts: state.post.userPosts,
});

export default connect(mapStateToProps)(ViewCurrentProfile);
