import React, { Fragment, useEffect, useRef, useState } from "react";
//import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import ProfileCard from "../Profile/Profile-Card/Profile-Card";

const Discover = () => {
  const rootRef = useRef(null);
  const [top, setTop] = useState(0);

  useEffect(() => {
    if (!rootRef || !rootRef.current) return;

    const clientHeight = rootRef.current.clientHeight;
    const relativeMargin = clientHeight - window.innerHeight;

    if (relativeMargin > 0) setTop(relativeMargin + 10);
  }, [rootRef]);

  return (
    <Fragment>
      <div ref={rootRef} className="side-area-container" style={{ top: -top }}>
        <div className="side-area-card">
          <p className="side-area-card-title text-center text-secondary">
            Discover Profiles
          </p>
          <hr />
          <ProfileCard />

          <Button color="info" className="mx-auto d-block mb-1">
            Load More
          </Button>
        </div>
      </div>
    </Fragment>
  );
};

Discover.propTypes = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Discover);
