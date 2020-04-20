import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { Button } from "reactstrap";
import { connect } from "react-redux";
import { dismissProfileCard } from "../../../actions/profile";
import PropTypes from "prop-types";
import DefaultImage from "../../../assets/images/sample-profile-picture.png";
import "./Profile-Card.css";

const ProfileCard = ({ profile, dismissProfileCard }) => {
  const DismissCard = () => {
    dismissProfileCard(profile._id);
  };

  return (
    <Fragment>
      <div className="profile-card px-2">
        <div className="d-flex flex-column align-items-center justify-content-center profile-card-container">
          <button className="dismiss-profile-card" onClick={DismissCard}>
            <span className="close-icon">&times;</span>
          </button>
          <img src={DefaultImage} alt="profile" className="profile-card-img" />
          <p className="profile-card-username text-dark mt-2 ml-2">
            @{profile.username}
          </p>
          <div className="profile-btn-group d-flex justify-content-center">
            <Button outline color="primary" className="py-1 mr-2">
              Follow
            </Button>
            <Link
              to={`/home/profile/view/${profile.user}`}
              className="btn btn-outline-success py-1 ml-2"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
      <hr />
    </Fragment>
  );
};

ProfileCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  dismissProfileCard: (id) => dispatch(dismissProfileCard(id)),
});

export default connect(null, mapDispatchToProps)(ProfileCard);
