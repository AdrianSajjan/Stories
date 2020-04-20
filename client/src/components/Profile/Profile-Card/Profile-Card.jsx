import React, { Fragment } from "react";
import PropTypes from "prop-types";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";
import "./Profile-Card.css";

const ProfileCard = ({ profile }) => {
  return (
    <Fragment>
      <div className="profile-card px-2">
        <div className="d-flex align-items-center justify-content-center">
          <img src={DefaultImage} alt="profile" className="profile-card-img" />
          <p className="profile-card-username text-dark mt-2 ml-2">@codex</p>
        </div>
        <div className="profile-btn-group mt-3 d-flex justify-content-center">
          <button className="btn btn-outline-primary py-1 mr-2">Follow</button>
          <button className="btn btn-outline-success py-1 ml-2">Profile</button>
        </div>
      </div>
      <hr />
    </Fragment>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileCard;
