import React, { Fragment, useEffect, useRef, useCallback } from "react";
import { connect } from "react-redux";
import { Row, Col, Spinner } from "reactstrap";
import { openSidebar } from "../../actions/sidebar";
import { getTimelinePosts } from "../../actions/post";
import CreatePost from "./CreatePost/CreatePost";
import Discover from "../Discover/Discover";
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
      var currentTimelineLoader = timelineLoader.current;
      timelineObserver.observe(currentTimelineLoader);
    }

    return () => {
      currentTimelineLoader &&
        timelineObserver.unobserve(currentTimelineLoader);
    };
  }, [timelineLoader, loadTimelinePosts]);

  return (
    <Fragment>
      <Row>
        <Col
          className="main-area"
          sm={{ size: 10, offset: 1 }}
          md={{ size: 12, offset: 0 }}
          lg="8"
        >
          <div className="main-area-header sticky-top">
            <button className="sidebar-toggler-btn" onClick={openSidebar}>
              <i className="fa fa-bars fa-lg"></i>
            </button>
            <h1 className="main-title text-primary">Home</h1>
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
                <CreatePost profile={profile} />
                {posts.length === 0 ? (
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
                          className="d-block mx-auto my-3"
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
        <Col lg="4" className="side-area d-none d-lg-block">
          {profile === null ? (
            userLoading && (
              <Spinner color="primary" className="d-block mx-auto my-5" />
            )
          ) : (
            <Discover />
          )}
        </Col>
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
