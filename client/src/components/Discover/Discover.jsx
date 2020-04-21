import React, { Fragment, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, Spinner } from "reactstrap";
import { connect } from "react-redux";
import { loadDiscoverProfiles } from "../../actions/profile";
import ProfileCard from "../Profile/Profile-Card/Profile-Card";

const Discover = ({ discoverProfiles, loadDiscoverProfiles }) => {
  const rootRef = useRef(null);
  const [top, setTop] = useState(0);
  const {
    profiles,
    loading: profilesLoading,
    endOfProfiles,
    currentPage: page,
  } = discoverProfiles;

  useEffect(() => {
    if (!rootRef || !rootRef.current) return;

    const clientHeight = rootRef.current.clientHeight;
    const relativeMargin = clientHeight - window.innerHeight;

    if (relativeMargin > 0) setTop(relativeMargin + 10);
  }, [rootRef]);

  useEffect(() => {
    profiles.length === 0 && loadProfiles();
    //eslint-disable-next-line
  }, []);

  const loadProfiles = () => {
    loadDiscoverProfiles(page);
  };

  const DiscoverBtn = () => {
    return (
      <Fragment>
        {endOfProfiles ? (
          <p className="text-center text-muted">No More Profiles.</p>
        ) : profilesLoading ? (
          <Spinner color="info" className="d-block mx-auto" />
        ) : (
          <Button
            color="info"
            className="mx-auto d-block mb-1"
            onClick={loadProfiles}
          >
            Load More
          </Button>
        )}
      </Fragment>
    );
  };

  const ProfileCards = () => {
    return (
      <Fragment>
        {profiles.map((profile) => (
          <ProfileCard key={profile._id} profile={profile} />
        ))}
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div ref={rootRef} className="side-area-container" style={{ top: -top }}>
        <div className="side-area-card">
          <p className="side-area-card-title text-center text-secondary">
            Discover Profiles
          </p>
          <hr />
          <ProfileCards />
          <DiscoverBtn />
        </div>
      </div>
    </Fragment>
  );
};

Discover.propTypes = {
  discoverProfiles: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  discoverProfiles: state.profile.discoverProfiles,
});

const mapDispatchToProps = (dispatch) => ({
  loadDiscoverProfiles: (page) => dispatch(loadDiscoverProfiles(page)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
