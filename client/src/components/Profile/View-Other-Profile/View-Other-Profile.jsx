import React, { Fragment, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { getProfileByID } from "../../../actions/profile";
import { getPostsByUser } from "../../../actions/post";
import ViewProfile from "../View-Profile-Template/_ViewProfile";
import Posts from "../../Posts/Posts";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";
import { Spinner } from "reactstrap";

const ViewOtherProfile = ({
  currentProfile,
  profileByID,
  getProfileByID,
  getPostsByUser,
  postsByUser,
}) => {
  const { id } = useParams();
  const { profile, loading: profileLoading } = profileByID;
  const { posts, loading: postsLoading } = postsByUser;

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

  useEffect(() => {
    if (currentProfile.profile && currentProfile.profile.user._id !== id) {
      getProfileByID(id);
      getPostsByUser(id);
    }
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
    if (profileLoading)
      return <Spinner color="primary" className="d-block my-4 mx-auto" />;
    else
      return <p className="text-center my-4 text-danger">Profile not found</p>;
  }

  return (
    <Fragment>
      <ViewProfile profile={profile} image={DefaultImage} owner={false} />
      <div className="view-posts mt-5">
        <h2 className="text-center py-2 text-secondary posts-heading">Posts</h2>
        <ViewPosts />
      </div>
    </Fragment>
  );
};

ViewOtherProfile.propTypes = {
  currentProfile: PropTypes.object.isRequired,
  profileByID: PropTypes.object.isRequired,
  getProfileByID: PropTypes.func.isRequired,
  getPostsByUser: PropTypes.func.isRequired,
  postsByUser: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
  profileByID: state.profile.profileByID,
  postsByUser: state.post.postsByUser,
});

const mapDispatchToProps = (dispatch) => ({
  getProfileByID: (id) => dispatch(getProfileByID(id)),
  getPostsByUser: (id) => dispatch(getPostsByUser(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewOtherProfile);
