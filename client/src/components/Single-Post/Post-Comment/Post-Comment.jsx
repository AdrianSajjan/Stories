import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Form, InputGroup, Input, InputGroupAddon, Button } from "reactstrap";
import { commentPost } from "../../../actions/post";
import { connect } from "react-redux";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";

const PostComment = ({
  currentProfile,
  postOwner,
  postID,
  postComments,
  commentPost,
}) => {
  const [comment, setComment] = useState("");

  const HandleSubmit = (e) => {
    e.preventDefault();

    if (comment.length === 0) return;

    commentPost(postID, comment);
    setComment("");
  };

  const CommentOptions = ({ commentOwner }) => {
    if (currentProfile === postOwner || currentProfile === commentOwner)
      return (
        <button className="comment-options-menu text-dark ml-4">
          <i className="fa fa-ellipsis-v"></i>
        </button>
      );
    else return null;
  };

  const RecentComments = () => {
    return (
      <Fragment>
        {postComments.map((comment, index) => (
          <div key={index} className="recent-comment">
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
              <div className="ml-auto d-flex">
                <small className="comment-time text-muted">
                  {moment(comment.date).fromNow()}
                </small>
                <CommentOptions commentOwner={comment.user} />
              </div>
            </div>
            <p className="text-dark ml-5 mr-3 mb-2">{comment.comment}</p>
          </div>
        ))}
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
});

export default connect(null, mapDispatchToProps)(PostComment);
