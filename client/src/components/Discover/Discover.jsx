import React, { Fragment, useEffect, useRef, useState } from "react";
//import PropTypes from "prop-types";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import ProfileCard from "../Profile/Profile-Card/Profile-Card";

const Discover = () => {
  const sideAreaRef = useRef(null);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", ToggleSticky);

    return () => {
      window.removeEventListener("scroll", ToggleSticky);
    };
  }, []);

  const ToggleSticky = (event) => {
    if (!sideAreaRef || !sideAreaRef.current) return;

    console.log(`client : ${sideAreaRef.current.clientHeight}`);
    console.log(`window : ${window.innerHeight}`);
  };

  return (
    <Fragment>
      <div
        ref={sideAreaRef}
        className={`side-area-container ${sticky && "sticky"}`}
      >
        <div className="side-area-card">
          <p className="side-area-card-title text-center text-secondary">
            Discover Profiles
          </p>
          <hr />
          <ProfileCard />
          <ProfileCard />
          <ProfileCard />
          <ProfileCard />
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
