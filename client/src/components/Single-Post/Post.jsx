import React, { useState, useEffect, Fragment } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DefaultImage from "../../assets/images/sample-profile-picture.png";
import { connect } from "react-redux";
import "./Post.css";

const Post = ({ post, currentProfile }) => {
  const { profile } = currentProfile;

  const [time, setTime] = useState("");
  const [options, setOptions] = useState(false);

  useEffect(() => {
    UpdateTime();
    const timeHandler = setInterval(UpdateTime, 1000);
    return () => {
      clearInterval(timeHandler);
    }; // eslint-disable-next-line
  }, []);

  const UpdateTime = () => {
    setTime(moment(post.date).fromNow());
  };

  const PostHasUserLike = () => {
    return post.likes.some((like) => like.profile._id === profile._id);
  };

  const PostHasUserComment = () => {
    return post.comments.some((comment) => comment.profile._id === profile._id);
  };

  const PostOptionClick = (event) => {
    setOptions((prevState) => !prevState);
  };

  const PostOptions = () => {
    if (!options) return null;
    return (
      <Fragment>
        <div className="post-options-menu">
          {post.user === profile.user._id ? (
            <Fragment>
              <button className="post-option py-2 px-4 text-success">
                Edit Post
              </button>
              <hr className="m-0" />
              <button className="post-option py-2 px-4 text-danger">
                Delete Post
              </button>
            </Fragment>
          ) : (
            <button className="post-option py-2 px-4 text-danger">
              Report Post
            </button>
          )}
        </div>
      </Fragment>
    );
  };

  return (
    <div className="post mt-3">
      <div className="post-header px-3 pt-4">
        <img src={DefaultImage} alt="profile" className="post-image" />
        <p className="post-username m-0 ml-2">@{post.profile.username}</p>
        <small className="post-time m-0 ml-auto">{time}</small>
      </div>
      <div className="post-body px-4 py-3">
        <p className="post-content m-0">{post.content}</p>
      </div>
      <div className="post-footer m-0 mt-2">
        <button
          className={
            PostHasUserLike()
              ? "post-like active m-0 py-2"
              : "post-like m-0 py-2"
          }
        >
          <i
            className={
              PostHasUserLike()
                ? "fa fa-thumbs-up fa-lg"
                : "fa fa-thumbs-o-up fa-lg"
            }
          ></i>
          <span className="ml-2">{post.likes.length}</span>
        </button>
        <button
          className={
            PostHasUserComment()
              ? "post-comment active m-0 py-2"
              : "post-comment m-0 py-2"
          }
        >
          <i
            className={
              PostHasUserComment()
                ? "fa fa-comment fa-lg"
                : "fa fa-comment-o fa-lg"
            }
          ></i>
          <span className="ml-2">{post.comments.length}</span>
        </button>
        <button
          className={`post-options m-0 pb-2 pt-3 ${options && "active"}`}
          onClick={PostOptionClick}
        >
          <i className="fa fa-ellipsis-h fa-lg"></i>
        </button>
      </div>
      <PostOptions />
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  currentProfile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  currentProfile: state.profile.currentProfile,
});

export default connect(mapStateToProps)(Post);
