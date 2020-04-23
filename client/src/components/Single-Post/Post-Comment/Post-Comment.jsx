import React, { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Form, InputGroup, Input, InputGroupAddon, Button } from "reactstrap";
import { commentPost, deleteCommentPost } from "../../../actions/post";
import { connect } from "react-redux";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";

const PostComment = ({
  currentProfile,
  postOwner,
  postID,
  postComments,
  commentPost,
  deleteCommentPost,
}) => {
  const [comment, setComment] = useState("");

  const HandleSubmit = (e) => {
    e.preventDefault();

    if (comment.length === 0) return;

    commentPost(postID, comment);
    setComment("");
  };

  const CommentOptions = ({ commentOwner, commentID }) => {
    const [deleteHover, setDeleteHover] = useState(false);

    if (currentProfile === postOwner || currentProfile === commentOwner)
      return (
        <Fragment>
          <button
            className="comment-option comment-option-danger ml-3"
            onMouseOver={() => setDeleteHover(true)}
            onMouseLeave={() => setDeleteHover(false)}
            onClick={() => deleteCommentPost(commentID)}
          >
            {deleteHover ? (
              <i className="fa fa-trash fa-lg"></i>
            ) : (
              <i className="fa fa-trash-o fa-lg"></i>
            )}
          </button>
        </Fragment>
      );
    else return null;
  };

  const RecentComments = () => {
    return (
      <Fragment>
        {postComments.map((comment) => (
          <RecentComment comment={comment} />
        ))}
      </Fragment>
    );
  };

  const RecentComment = ({ comment }) => {
    const [time, setTime] = useState("");

    useEffect(() => {
      UpdateTime();
      const timeHandler = setInterval(UpdateTime, 60000);
      return () => {
        clearInterval(timeHandler);
      }; // eslint-disable-next-line
    }, []);

    const UpdateTime = () => {
      setTime(moment(comment.date).fromNow());
    };
    return (
      <Fragment>
        <div key={comment._id} className="recent-comment">
          <hr className="my-2" />
          <div className="d-flex align-items-center">
            <img
              src={DefaultImage}
              alt="profile"
              className="comment-profile-img my-0"
            />
            <p className="comment-username ml-2 my-0 font-weight-bold">
              @{comment.profile.username}
            </p>
            <div className="ml-auto d-flex align-items-center">
              <small className="comment-time text-muted">{time}</small>
              <CommentOptions
                commentOwner={comment.user}
                commentID={comment._id}
              />
            </div>
          </div>
          <p className="text-dark ml-5 mr-3 mb-2">{comment.comment}</p>
        </div>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div className="post-comments">
        <hr className="my-2" />
        {postComments.length > 0 && (
          <Fragment>
            <p className="text-muted px-3 my-2">Recent Comments</p>
            <div className="recent-comments px-3 pb-1">
              <RecentComments />
            </div>
            <hr className="mt-0 mb-2" />
          </Fragment>
        )}
        <Form className="comment-form pb-2 px-3" onSubmit={HandleSubmit}>
          <InputGroup>
            <Input
              name="comment"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ boxShadow: "none" }}
            />
            <InputGroupAddon addonType="append">
              <Button
                outline
                color={comment.length > 0 ? "info" : "secondary"}
                disabled={comment.length > 0 ? false : true}
                style={{ boxShadow: "none" }}
              >
                Send
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </Form>
      </div>
    </Fragment>
  );
};

PostComment.propTypes = {
  commentPost: PropTypes.func.isRequired,
  postID: PropTypes.string.isRequired,
  postComments: PropTypes.array.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  commentPost: (id, comment) => dispatch(commentPost(id, comment)),
  deleteCommentPost: (comment) => dispatch(deleteCommentPost(comment)),
});

export default connect(null, mapDispatchToProps)(PostComment);
