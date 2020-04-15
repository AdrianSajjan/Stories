import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import DefaultImage from "../../assets/images/sample-profile-picture.png";
import { connect } from "react-redux";
import "./Post.css";

const Post = ({ post, profile }) => {
  // Single-Post
  const { currentProfile } = profile;

  const [time, setTime] = useState("");
  useEffect(
    () => {
      UpdateTime();
      const timeHandler = setInterval(UpdateTime, 1000);
      return () => {
        clearInterval(timeHandler);
      };
    }, // eslint-disable-next-line
    []
  );

  const UpdateTime = () => {
    setTime(moment(post.date).fromNow());
  };

  const PostHasUserLike = () => {
    return post.likes.some((like) => like.profile._id === currentProfile._id);
  };

  const PostHasUserComment = () => {
    return post.comments.some(
      (comment) => comment.profile._id === currentProfile._id
    );
  };

  return (
    <div className="post">
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
              ? "post-like active m-0 py-1"
              : "post-like m-0 py-1"
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
              ? "post-comment active m-0 py-1"
              : "post-comment m-0 py-1"
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
      </div>
    </div>
  );
};

Post.propTypes = {
  post: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps)(Post);
