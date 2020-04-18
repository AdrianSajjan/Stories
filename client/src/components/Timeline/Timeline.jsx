import React, { Fragment, useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import { Row, Col, Spinner } from "reactstrap";
import { openSidebar } from "../../actions/sidebar";
import { getTimelinePosts } from "../../actions/post";
import CreatePost from "./CreatePost/CreatePost";
import Posts from "../Posts/Posts";

const Timeline = ({
  getTimelinePosts,
  postsByFollowing,
  openSidebar,
  currentProfile,
}) => {
  // Timeline
  const {
    posts,
    loading: postsLoading,
    currentPage: page,
    endOfPosts,
  } = postsByFollowing;
  const { profile, loading: userLoading } = currentProfile;

  const timelineLoader = useRef(null);

  const loadTimelinePosts = useCallback(
    (entries) => {
      const target = entries[0];
      if (target.isIntersecting && !postsLoading && !endOfPosts)
        getTimelinePosts(page);
    },
    [postsLoading, getTimelinePosts, page, endOfPosts]
  );

  useEffect(() => {
    getTimelinePosts(page);
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.25,
    };

    const timelineObserver = new IntersectionObserver(
      loadTimelinePosts,
      observerOptions
    );

    if (timelineLoader && timelineLoader.current) {
      timelineObserver.observe(timelineLoader.current);
    }

    return () => {
      //eslint-disable-next-line
      timelineObserver.unobserve(timelineLoader.current);
    };
  }, [timelineLoader, loadTimelinePosts]);

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
          <div className="main-timeline-area">
            {profile === null ? (
              userLoading ? (
                <Spinner color="primary" className="d-block mx-auto my-5" />
              ) : (
                <p className="mt-4 text-center text-muted">
                  Create your profile to see what others post.
                </p>
              )
            ) : (
              <Fragment>
                <CreatePost />
                {postsByFollowing.length === 0 ? (
                  postsLoading ? (
                    <Spinner color="primary" className="d-block mx-auto my-5" />
                  ) : (
                    <p className="mt-4 text-center text-muted">
                      Start following users to see their posts.
                    </p>
                  )
                ) : (
                  <Fragment>
                    <Posts posts={posts} />
                    <div className="timeline-loader" ref={timelineLoader}>
                      {postsLoading ? (
                        <Spinner
                          color="primary"
                          className="d-block mx-auto my-5"
                        />
                      ) : (
                        <p className="text-muted text-center my-3">
                          End of Posts
                        </p>
                      )}
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </div>
        </Col>
        <Col className="side-area bg-light d-sm-block d-md-none d-lg-block"></Col>
      </Row>
    </Fragment>
  );
};

const mapStateToProps = (state) => ({
  postsByFollowing: state.post.postsByFollowing,
  currentProfile: state.profile.currentProfile,
});

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar()),
  getTimelinePosts: (page) => dispatch(getTimelinePosts(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
