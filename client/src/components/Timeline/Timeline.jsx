import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { openSidebar } from "../../actions/sidebar";
import CreatePost from "./CreatePost/CreatePost";
import Posts from "../Posts/Posts";

const Timeline = ({ posts, openSidebar }) => {
  // Timeline
  const { postsByFollowing } = posts;

  return (
    <Fragment>
      <Row>
        <Col className="main-area p-0" sm="8" md="12" lg="8">
          <div className="main-area-header sticky-top bg-light">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <h1 className="main-title text-secondary">Home</h1>
          </div>
          <div className="main-timeline-area pb-5">
            <CreatePost />
            <Posts posts={postsByFollowing} />
          </div>
        </Col>
        <Col className="side-area bg-light d-sm-block d-md-none d-lg-block"></Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  posts: state.post,
});

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
